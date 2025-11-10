# 📊 Jury Mode - Code Analysis Feature Documentation

## Overview
The **Code Analysis** feature shows quality metrics for your code **before** questions are generated. This helps you understand your code's strengths and weaknesses before testing your knowledge.

---

## 🎯 User Flow

1. **Click "Begin Jury Mode"** button
2. **Disclaimer Modal appears** with warning about academic integrity
3. **User accepts** → Analysis starts with loading spinner
4. **Code Analysis Metrics** displayed above project summary
5. **10 Questions appear** (7 conceptual + 3 coding)
6. **User submits answers** → Evaluation with scores
7. **Results shown** with flash cards for improvement

---

## 📈 Code Analysis Metrics

### 1. **Memory Management** (Circular Progress 0-10)
- **Visual:** Green circular progress bar
- **Measures:** Memory efficiency, leak prevention, resource cleanup
- **Score:**
  - 8-10: Excellent memory practices
  - 5-7: Good with minor issues
  - 0-4: Needs improvement

### 2. **Algorithmic Complexity** (Gradient Bar)
- **Visual:** Horizontal bar (green → yellow → red)
- **Measures:** Time complexity of algorithms
- **Labels:**
  - O(1) - Constant (best)
  - O(n) - Linear
  - O(n log n)
  - O(n²) - Quadratic
  - O(2ⁿ) - Exponential
  - O(n!) - Factorial (worst)
- **Position:** Bar fills left-to-right based on complexity

### 3. **Runtime Efficiency** (Circular Progress 0-10)
- **Visual:** Blue circular progress bar
- **Measures:** Overall performance and speed
- **Considers:** Loop optimizations, caching, unnecessary computations

### 4. **Security** (Shield Badge)
- **Visual:** Shield icon with colored risk badge
- **Risk Levels:**
  - 🟢 **Low Risk:** Green badge - secure practices
  - 🟡 **Medium Risk:** Yellow badge - some concerns
  - 🔴 **High Risk:** Red badge - critical issues
- **Checks:** Input validation, SQL injection risks, XSS vulnerabilities

### 5. **Reliability** (Stacked Bars)
- **Visual:** Two horizontal bars
  - ✓ **Handled Errors** (green) - Proper error handling
  - ✗ **Unhandled Errors** (red) - Missing try-catch blocks
- **Shows:** Error handling coverage

### 6. **Maintainability** (Color-Coded Tag)
- **Visual:** Large colored badge
- **Ratings:**
  - ✓ **Good:** Green - clean, well-structured code
  - ~ **Fair:** Yellow - acceptable but could improve
  - ✗ **Poor:** Red - hard to maintain, refactoring needed
- **Considers:** Code readability, naming conventions, comments

### 7. **Scalability** (Circular Progress 0-10)
- **Visual:** Purple circular progress bar
- **Measures:** Modularity, extensibility, architecture
- **Score:**
  - 8-10: Highly modular, easy to extend
  - 5-7: Decent structure
  - 0-4: Monolithic, hard to scale

---

## ⚠️ Disclaimer Modal

**Purpose:** Educate users about academic integrity

**Text:**
> "VibeFlow Jury Mode is for learning and understanding your own code.
> Please do not copy or reuse AI-generated answers in academic submissions — it's designed to guide, not replace, your understanding."

**Buttons:**
- **Cancel:** Close modal, stay on idle screen
- **I Understand:** Accept and start analysis

---

## 🎨 Visual Design

### Layout
```
┌─────────────────────────────────────┐
│  📊 Code Analysis                   │
│  Quality metrics for your project   │
├─────────────────────────────────────┤
│  [Memory]  [Runtime]  [Scalability] │  ← Top row (circular)
│  [Complexity Bar]                   │  ← Full width gradient
│  [Security]  [Maintainability]      │  ← Middle row
│  [Reliability Bars]                 │  ← Bottom (full width)
└─────────────────────────────────────┘
```

### Colors
- **Background:** `#202020` (dark gray)
- **Metric cards:** `#181818` (darker)
- **Accent:** Electric purple (`#7F5AF0`)
- **Green metrics:** `#10b981`
- **Blue metrics:** `#3b82f6`
- **Security colors:**
  - Low: Green `#10b981`
  - Medium: Yellow `#eab308`
  - High: Red `#ef4444`

### Animations
- **Circular progress:** 1s ease-out fill animation
- **Gradient bar:** 1s width expansion
- **Cards:** Hover scale on flash cards

---

## 🔧 Technical Implementation

### Backend Changes (`server.js`)
```javascript
// Updated prompt includes metrics generation
{
  "metrics": {
    "memory_management": 8,
    "algorithmic_complexity": 3,
    "runtime_efficiency": 7,
    "security": "Low",
    "reliability": { "handled": 12, "unhandled": 2 },
    "maintainability": "Good",
    "scalability": 9
  },
  "summary": "...",
  "concepts": [...],
  "questions": [...]
}
```

### Frontend Components

1. **DisclaimerModal.tsx**
   - Modal overlay with warning
   - Accept/Cancel buttons
   - Triggered on "Begin Jury Mode" click

2. **CodeAnalysis.tsx**
   - Main metrics display component
   - 7 sub-components for each metric
   - Grid layout (responsive)
   - Animations on mount

3. **JuryPlaceholder.tsx** (updated)
   - Added disclaimer state
   - Shows CodeAnalysis above questions
   - Updated flow: idle → disclaimer → analyzing → metrics + questions

### API Types (`api.ts`)
```typescript
interface CodeMetrics {
  memory_management: number;
  algorithmic_complexity: number;
  runtime_efficiency: number;
  security: 'Low' | 'Medium' | 'High';
  reliability: { handled: number; unhandled: number };
  maintainability: 'Good' | 'Fair' | 'Poor';
  scalability: number;
}

interface AnalyzeResponse {
  metrics: CodeMetrics;  // New field
  summary: string;
  concepts: string[];
  questions: string[];
}
```

---

## 📝 Usage Example

**Before:**
```
Click "Begin" → Loading → Questions → Answers → Results
```

**After:**
```
Click "Begin" 
  → Disclaimer Modal ("I Understand")
  → Loading (analyzing...)
  → Code Analysis Metrics ✨ NEW
  → Project Summary
  → 10 Questions (7 conceptual + 3 coding)
  → Submit Answers
  → Results (scores + flash cards)
```

---

## 🚀 Testing Checklist

- [ ] Click "Begin Jury Mode"
- [ ] Verify disclaimer modal appears
- [ ] Click "Cancel" → stays on idle screen
- [ ] Click "Begin" again
- [ ] Click "I Understand" → loading starts
- [ ] Wait for analysis to complete
- [ ] Verify all 7 metrics appear correctly
- [ ] Verify circular progress bars animate
- [ ] Verify complexity gradient bar fills
- [ ] Verify security shield shows correct color
- [ ] Verify reliability bars show handled/unhandled
- [ ] Verify maintainability tag has correct color
- [ ] Verify project summary appears below metrics
- [ ] Verify 10 questions render
- [ ] Submit answers
- [ ] Verify results display

---

## 🎓 Educational Value

### What Students Learn

1. **Code Quality Awareness**
   - See objective metrics for their code
   - Understand industry-standard quality measures
   - Identify weak areas before being asked questions

2. **Best Practices**
   - Memory management importance
   - Time complexity optimization
   - Security considerations
   - Error handling patterns

3. **Self-Assessment**
   - Compare their perceived understanding vs metrics
   - Prioritize learning based on weakest areas
   - Track improvement over time

---

## 🔒 Rate Limiting

- **API calls remain:** 10 RPM, 500 RPD
- **No additional calls:** Metrics included in existing analyze call
- **Cooldown:** 7 seconds between requests

---

## 🎯 Success Criteria

✅ User understands disclaimer  
✅ Metrics load without errors  
✅ All 7 metrics display correctly  
✅ Visual design matches VibeFlow style  
✅ Animations are smooth  
✅ Mobile responsive  
✅ No performance issues  
✅ API rate limits respected  

---

## 📚 Next Steps (Future Enhancements)

- [ ] Historical metrics tracking (trend over time)
- [ ] Detailed breakdowns per metric
- [ ] Comparison with industry standards
- [ ] Export metrics as PDF report
- [ ] Team/class leaderboards
- [ ] Custom metric thresholds

---

## 🐛 Troubleshooting

**Issue:** Metrics not showing  
**Fix:** Check backend logs, verify Gemini API is responding with metrics object

**Issue:** Disclaimer modal not appearing  
**Fix:** Check browser console for React errors, verify DisclaimerModal import

**Issue:** Scores always 0  
**Fix:** Backend prompt may not be parsed correctly, check JSON response format

**Issue:** Circular progress bars not animating  
**Fix:** Verify Tailwind CSS `transition-all` classes are compiled

---

**Version:** 2.0  
**Last Updated:** November 10, 2025  
**Author:** VibeFlow Team
