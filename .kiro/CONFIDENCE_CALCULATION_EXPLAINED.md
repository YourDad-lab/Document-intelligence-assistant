# Overall Confidence Calculation

## What Changed

The dashboard now shows **Overall Confidence** instead of just "High Confidence" percentage.

## How It's Calculated

The system uses a weighted scoring system:

- **High confidence** = 100 points
- **Medium confidence** = 60 points  
- **Low confidence** = 20 points

### Formula
```
Overall Confidence % = (High×100 + Medium×60 + Low×20) / Total Queries
```

## Examples

### Your Current Situation (2 medium queries)
```
High: 0 queries × 100 = 0
Medium: 2 queries × 60 = 120
Low: 0 queries × 20 = 0
Total: 2 queries

Overall Confidence = 120 / 2 = 60%
```

### Mixed Example (5 queries)
```
High: 2 queries × 100 = 200
Medium: 2 queries × 60 = 120
Low: 1 query × 20 = 20
Total: 5 queries

Overall Confidence = 340 / 5 = 68%
```

### All High Confidence (3 queries)
```
High: 3 queries × 100 = 300
Medium: 0 queries × 60 = 0
Low: 0 queries × 20 = 0
Total: 3 queries

Overall Confidence = 300 / 3 = 100%
```

## Why This Is Better

1. **Shows all confidence levels**: Previously only counted "high" confidence
2. **Weighted scoring**: Reflects quality - high confidence is worth more
3. **More accurate**: Gives you a true picture of answer quality
4. **Fair representation**: Medium confidence queries now contribute to the score

## What You'll See

After restarting the analytics server:
- Your 2 medium confidence queries will show as **60%** overall confidence
- As you ask more questions, the percentage will update based on the mix
- High confidence answers will push the percentage up
- Low confidence answers will pull it down

## Restart Command

```bash
cd .kiro/analytics_dashboard
# Stop the server (Ctrl+C)
node server.js
```

Then refresh your dashboard at http://localhost:5000
