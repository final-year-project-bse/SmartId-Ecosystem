# Contributing to SmartID Frontend

Thank you for your interest in contributing to SmartID! We welcome contributions from the community.

## 🚀 Getting Started

1. **Fork the repository**
   - Click the "Fork" button at the top right of the repository page

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/smartid-frontend.git
   cd smartid-frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Workflow

1. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary

2. **Test your changes**
   ```bash
   npm run dev
   ```
   - Test on different screen sizes
   - Test with different roles (Admin, Professor, Student)
   - Test theme switching (light/dark)
   - Test language switching (EN/UR)

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

## 📝 Commit Message Guidelines

Use conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add QR code authentication method
fix: resolve dark mode toggle issue
docs: update installation instructions
style: format code with prettier
refactor: simplify attendance calculation
```

## 🎨 Code Style

- Use **functional components** with hooks
- Use **Tailwind CSS** for styling
- Follow **React best practices**
- Keep components **small and focused**
- Use **meaningful variable names**
- Add **JSDoc comments** for complex functions

## 📁 Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── store/           # State management
├── services/        # API services
├── utils/           # Utility functions
├── i18n/            # Translations
└── styles/          # Global styles
```

## 🧪 Testing

Before submitting a PR:

1. Test all three portals (Admin, Professor, Student)
2. Test on mobile, tablet, and desktop
3. Test light and dark modes
4. Test English and Urdu languages
5. Ensure no console errors

## 📤 Submitting a Pull Request

1. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template

3. **PR Description should include:**
   - What changes were made
   - Why the changes were needed
   - Screenshots (if UI changes)
   - Testing steps

## 🐛 Reporting Bugs

When reporting bugs, please include:

- **Description** - Clear description of the bug
- **Steps to Reproduce** - How to reproduce the issue
- **Expected Behavior** - What should happen
- **Actual Behavior** - What actually happens
- **Screenshots** - If applicable
- **Environment** - Browser, OS, Node version

## 💡 Feature Requests

We welcome feature requests! Please include:

- **Description** - Clear description of the feature
- **Use Case** - Why this feature is needed
- **Proposed Solution** - How you think it should work
- **Alternatives** - Other solutions you've considered

## 📋 Code Review Process

1. Maintainers will review your PR
2. They may request changes
3. Make requested changes and push updates
4. Once approved, your PR will be merged

## 🎯 Areas for Contribution

We especially welcome contributions in:

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🌐 Translations (new languages)
- ♿ Accessibility improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations

## 📞 Questions?

If you have questions:

- Open an issue with the "question" label
- Join our community discussions
- Contact the maintainers

## 🙏 Thank You!

Your contributions make SmartID better for everyone. Thank you for taking the time to contribute!

---

**Happy Coding! 🚀**
