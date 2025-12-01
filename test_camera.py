"""
Standalone script to test camera and face detection
Run this to verify your camera is working and can detect faces
"""

import cv2
import face_recognition
import numpy as np

def test_camera():
    """Test if camera is accessible"""
    print("Testing camera access...")
    video_capture = cv2.VideoCapture(0)
    
    if not video_capture.isOpened():
        print("❌ ERROR: Could not access camera!")
        print("Please check:")
        print("1. Camera is connected")
        print("2. Camera permissions are granted")
        print("3. No other application is using the camera")
        return False
    
    print("✅ Camera is accessible!")
    video_capture.release()
    return True

def test_face_detection():
    """Test real-time face detection"""
    print("\n" + "="*50)
    print("Starting Face Detection Test")
    print("="*50)
    print("\nInstructions:")
    print("- Position your face in front of the camera")
    print("- Green rectangle will appear around detected faces")
    print("- Press 'q' to quit")
    print("- Press 's' to take a screenshot")
    print("\nStarting in 3 seconds...")
    
    import time
    time.sleep(3)
    
    video_capture = cv2.VideoCapture(0)
    
    # Set camera resolution
    video_capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    video_capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    face_count = 0
    frame_count = 0
    
    print("\n📹 Camera is now active...")
    
    while True:
        ret, frame = video_capture.read()
        
        if not ret:
            print("❌ Failed to grab frame")
            break
        
        frame_count += 1
        
        # Process every 5th frame for performance
        if frame_count % 5 == 0:
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Detect faces
            face_locations = face_recognition.face_locations(rgb_frame, model='hog')
            
            # Draw rectangles around faces
            for (top, right, bottom, left) in face_locations:
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                
                # Draw label
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 255, 0), cv2.FILLED)
                cv2.putText(frame, "Face Detected", (left + 6, bottom - 6), 
                           cv2.FONT_HERSHEY_DUPLEX, 0.6, (255, 255, 255), 1)
                
                face_count += 1
            
            # Display face count
            cv2.putText(frame, f"Faces Detected: {len(face_locations)}", (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # Display instructions
        cv2.putText(frame, "Press 'q' to quit, 's' for screenshot", (10, frame.shape[0] - 10),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # Display frame
        cv2.imshow('SmartID - Face Detection Test', frame)
        
        # Handle key presses
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            print("\n✅ Test completed!")
            break
        elif key == ord('s'):
            filename = f'screenshot_{frame_count}.jpg'
            cv2.imwrite(filename, frame)
            print(f"📸 Screenshot saved: {filename}")
    
    video_capture.release()
    cv2.destroyAllWindows()
    
    print(f"\n📊 Statistics:")
    print(f"   Total frames processed: {frame_count}")
    print(f"   Total faces detected: {face_count}")
    
    return True

def test_face_encoding():
    """Test face encoding generation"""
    print("\n" + "="*50)
    print("Testing Face Encoding")
    print("="*50)
    print("\nThis will capture your face and generate an encoding...")
    print("Press SPACE when ready, ESC to cancel")
    
    video_capture = cv2.VideoCapture(0)
    
    while True:
        ret, frame = video_capture.read()
        
        if not ret:
            break
        
        # Convert to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Detect faces
        face_locations = face_recognition.face_locations(rgb_frame)
        
        # Draw rectangles
        for (top, right, bottom, left) in face_locations:
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        
        cv2.putText(frame, "Press SPACE to capture", (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        cv2.imshow('Capture Face for Encoding', frame)
        
        key = cv2.waitKey(1) & 0xFF
        if key == 32:  # SPACE
            if face_locations:
                print("\n✅ Face detected! Generating encoding...")
                
                # Generate encoding
                face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
                
                if face_encodings:
                    encoding = face_encodings[0]
                    print(f"✅ Encoding generated successfully!")
                    print(f"   Encoding shape: {encoding.shape}")
                    print(f"   Encoding type: {type(encoding)}")
                    print(f"   First 5 values: {encoding[:5]}")
                else:
                    print("❌ Failed to generate encoding")
                break
            else:
                print("❌ No face detected. Please try again.")
        elif key == 27:  # ESC
            print("\n❌ Cancelled")
            break
    
    video_capture.release()
    cv2.destroyAllWindows()
    
    return True

def main():
    """Main test function"""
    print("\n" + "="*50)
    print("SmartID Camera & Face Detection Test")
    print("="*50)
    
    # Test 1: Camera Access
    if not test_camera():
        return
    
    # Test 2: Face Detection
    print("\n\nTest 1: Real-time Face Detection")
    print("-" * 50)
    response = input("Start face detection test? (y/n): ")
    if response.lower() == 'y':
        test_face_detection()
    
    # Test 3: Face Encoding
    print("\n\nTest 2: Face Encoding Generation")
    print("-" * 50)
    response = input("Test face encoding? (y/n): ")
    if response.lower() == 'y':
        test_face_encoding()
    
    print("\n" + "="*50)
    print("All tests completed!")
    print("="*50)
    print("\nYour camera and face detection are working correctly! ✅")
    print("You can now use the SmartID attendance system.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Test interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Error: {str(e)}")
        print("\nPlease make sure you have installed:")
        print("  pip install opencv-python face-recognition numpy")
