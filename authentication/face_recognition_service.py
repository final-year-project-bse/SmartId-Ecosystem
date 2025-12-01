import face_recognition
import cv2
import numpy as np
import pickle
import os
from PIL import Image
from django.conf import settings
from django.core.files.storage import default_storage
from .models import FaceEnrollment

# Check if face_recognition is available
try:
    import face_recognition
    FACE_RECOGNITION_AVAILABLE = True
except ImportError:
    FACE_RECOGNITION_AVAILABLE = False


class FaceRecognitionService:
    """Service for handling face recognition operations"""
    
    def __init__(self):
        self.known_face_encodings = []
        self.known_face_ids = []
        self.known_face_names = []
        self.tolerance = 0.6  # Lower is more strict
        
    def load_known_faces(self):
        """Load all enrolled faces from database"""
        enrollments = FaceEnrollment.objects.select_related('user').all()
        
        self.known_face_encodings = []
        self.known_face_ids = []
        self.known_face_names = []
        
        for enrollment in enrollments:
            if enrollment.face_encoding:
                # Deserialize the face encoding
                encoding = pickle.loads(enrollment.face_encoding)
                self.known_face_encodings.append(encoding)
                self.known_face_ids.append(enrollment.user.id)
                self.known_face_names.append(
                    enrollment.user.get_full_name() or enrollment.user.username
                )
        
        return len(self.known_face_encodings)
    
    def enroll_face(self, user, image_path):
        """
        Enroll a new face for a user
        
        Args:
            user: User object
            image_path: Path to the face image
            
        Returns:
            dict: Result with success status and message
        """
        try:
            # Load image using PIL first, then convert to numpy array
            try:
                pil_image = Image.open(image_path)
                # Convert to RGB if needed
                if pil_image.mode != 'RGB':
                    pil_image = pil_image.convert('RGB')
                # Convert PIL image to numpy array
                image = np.array(pil_image)
            except Exception as e:
                return {
                    'success': False,
                    'message': f'Could not load image file: {str(e)}'
                }
            
            # Find face locations
            face_locations = face_recognition.face_locations(image)
            
            if len(face_locations) == 0:
                return {
                    'success': False,
                    'message': 'No face detected in the image. Please ensure your face is clearly visible.'
                }
            
            if len(face_locations) > 1:
                return {
                    'success': False,
                    'message': 'Multiple faces detected. Please ensure only one face is in the image.'
                }
            
            # Get face encoding
            face_encodings = face_recognition.face_encodings(image, face_locations)
            
            if len(face_encodings) == 0:
                return {
                    'success': False,
                    'message': 'Could not encode face. Please try with a clearer image.'
                }
            
            face_encoding = face_encodings[0]
            
            # Save face image to permanent storage
            image_filename = f'faces/{user.id}_{os.path.basename(image_path)}'
            
            # Copy image to permanent storage
            with open(image_path, 'rb') as f:
                saved_path = default_storage.save(image_filename, f)
            
            # Serialize face encoding
            encoding_bytes = pickle.dumps(face_encoding)
            
            # Save or update enrollment
            enrollment, created = FaceEnrollment.objects.update_or_create(
                user=user,
                defaults={
                    'face_image': saved_path,
                    'face_encoding': encoding_bytes
                }
            )
            
            return {
                'success': True,
                'message': 'Face enrolled successfully' if created else 'Face updated successfully',
                'user_id': user.id,
                'user_name': user.get_full_name() or user.username
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Error enrolling face: {str(e)}'
            }
    
    def recognize_face(self, image_path, return_all_matches=False):
        """
        Recognize a face from an image
        
        Args:
            image_path: Path to the image
            return_all_matches: If True, return all matches above threshold
            
        Returns:
            dict: Result with success status and recognized user info
        """
        try:
            # Load known faces
            self.load_known_faces()
            
            if len(self.known_face_encodings) == 0:
                return {
                    'success': False,
                    'message': 'No enrolled faces found. Please enroll users first.'
                }
            
            # Load image using PIL
            try:
                pil_image = Image.open(image_path)
                if pil_image.mode != 'RGB':
                    pil_image = pil_image.convert('RGB')
                image = np.array(pil_image)
            except Exception as e:
                return {
                    'success': False,
                    'message': f'Could not load image file: {str(e)}'
                }
            
            # Find face locations
            face_locations = face_recognition.face_locations(image)
            
            if len(face_locations) == 0:
                return {
                    'success': False,
                    'message': 'No face detected in the image.'
                }
            
            # Get face encodings
            face_encodings = face_recognition.face_encodings(image, face_locations)
            
            results = []
            
            for face_encoding in face_encodings:
                # Compare with known faces
                face_distances = face_recognition.face_distance(
                    self.known_face_encodings, 
                    face_encoding
                )
                
                # Get best match
                best_match_index = np.argmin(face_distances)
                best_distance = face_distances[best_match_index]
                
                if best_distance <= self.tolerance:
                    confidence = 1 - best_distance
                    
                    results.append({
                        'user_id': self.known_face_ids[best_match_index],
                        'user_name': self.known_face_names[best_match_index],
                        'confidence': float(confidence),
                        'distance': float(best_distance)
                    })
                    
                    if not return_all_matches:
                        break
            
            if results:
                return {
                    'success': True,
                    'message': 'Face recognized successfully',
                    'results': results
                }
            else:
                return {
                    'success': False,
                    'message': 'Face not recognized. Please try again or enroll first.'
                }
                
        except Exception as e:
            return {
                'success': False,
                'message': f'Error recognizing face: {str(e)}'
            }
    
    def recognize_face_from_camera(self, duration=5):
        """
        Recognize face from webcam
        
        Args:
            duration: Duration in seconds to capture
            
        Returns:
            dict: Result with success status and recognized user info
        """
        try:
            # Load known faces
            self.load_known_faces()
            
            if len(self.known_face_encodings) == 0:
                return {
                    'success': False,
                    'message': 'No enrolled faces found. Please enroll users first.'
                }
            
            # Open webcam
            video_capture = cv2.VideoCapture(0)
            
            if not video_capture.isOpened():
                return {
                    'success': False,
                    'message': 'Could not access webcam. Please check your camera.'
                }
            
            recognized_user = None
            best_confidence = 0
            frame_count = 0
            max_frames = duration * 30  # Assuming 30 fps
            
            while frame_count < max_frames:
                ret, frame = video_capture.read()
                
                if not ret:
                    break
                
                # Process every 5th frame for performance
                if frame_count % 5 == 0:
                    # Convert BGR to RGB
                    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    
                    # Find faces
                    face_locations = face_recognition.face_locations(rgb_frame)
                    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
                    
                    for face_encoding in face_encodings:
                        # Compare with known faces
                        face_distances = face_recognition.face_distance(
                            self.known_face_encodings,
                            face_encoding
                        )
                        
                        best_match_index = np.argmin(face_distances)
                        best_distance = face_distances[best_match_index]
                        
                        if best_distance <= self.tolerance:
                            confidence = 1 - best_distance
                            
                            if confidence > best_confidence:
                                best_confidence = confidence
                                recognized_user = {
                                    'user_id': self.known_face_ids[best_match_index],
                                    'user_name': self.known_face_names[best_match_index],
                                    'confidence': float(confidence)
                                }
                
                frame_count += 1
            
            video_capture.release()
            
            if recognized_user:
                return {
                    'success': True,
                    'message': 'Face recognized successfully',
                    **recognized_user
                }
            else:
                return {
                    'success': False,
                    'message': 'Face not recognized. Please try again or enroll first.'
                }
                
        except Exception as e:
            return {
                'success': False,
                'message': f'Error recognizing face from camera: {str(e)}'
            }
    
    def verify_face_match(self, user, image_path):
        """
        Verify if a face matches a specific user
        
        Args:
            user: User object
            image_path: Path to the image
            
        Returns:
            dict: Result with success status and match info
        """
        try:
            # Get user's enrollment
            try:
                enrollment = FaceEnrollment.objects.get(user=user)
            except FaceEnrollment.DoesNotExist:
                return {
                    'success': False,
                    'message': 'User has not enrolled their face yet.'
                }
            
            if not enrollment.face_encoding:
                return {
                    'success': False,
                    'message': 'User face encoding not found.'
                }
            
            # Load user's face encoding
            known_encoding = pickle.loads(enrollment.face_encoding)
            
            # Load and encode the new image
            image = face_recognition.load_image_file(image_path)
            face_locations = face_recognition.face_locations(image)
            
            if len(face_locations) == 0:
                return {
                    'success': False,
                    'message': 'No face detected in the image.'
                }
            
            face_encodings = face_recognition.face_encodings(image, face_locations)
            
            if len(face_encodings) == 0:
                return {
                    'success': False,
                    'message': 'Could not encode face from image.'
                }
            
            # Compare faces
            face_encoding = face_encodings[0]
            distance = face_recognition.face_distance([known_encoding], face_encoding)[0]
            
            is_match = distance <= self.tolerance
            confidence = 1 - distance
            
            return {
                'success': True,
                'is_match': bool(is_match),
                'confidence': float(confidence),
                'distance': float(distance),
                'message': 'Face matches' if is_match else 'Face does not match'
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Error verifying face: {str(e)}'
            }
