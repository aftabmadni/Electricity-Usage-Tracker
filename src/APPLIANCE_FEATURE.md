# WattWise Appliance Management Feature

## Overview

The Appliance Management feature allows users to track their household appliances' energy consumption and costs. It includes a guided onboarding flow for first-time users and a comprehensive management dashboard.

## Features

### 1. **Onboarding Flow** 
When a user logs in for the first time (or hasn't added appliances), they see the onboarding screen:

- ⚡ Clean, welcoming UI with gradient background
- 📝 Simple form to add multiple appliances
- ➕ Dynamic row addition/removal
- 💡 Quick-add buttons for common appliances (AC, Refrigerator, TV, etc.)
- ✅ Form validation for all inputs
- 🎯 "Save & Continue" to complete setup

**Fields per Appliance:**
- **Name**: String (e.g., "Air Conditioner")
- **Power**: Watts (e.g., 1500W)
- **Hours per Day**: Number (0-24)
- **Days per Month**: Number (0-31)

### 2. **Appliance Management Dashboard**

Access via the "My Appliances" tab on the main dashboard:

#### Summary Cards
- **Total Consumption**: Monthly kWh usage across all appliances
- **Estimated Bill**: Total monthly cost in selected currency
- **Potential Savings**: AI-calculated optimization percentage

#### AI-Powered Insights
- Identifies top energy consumers
- Detects high-usage patterns (>8 hours/day)
- Provides actionable recommendations
- Calculates potential savings opportunities

#### Interactive Charts
Two side-by-side bar charts:
1. **Energy Usage by Appliance**: Monthly kWh consumption
2. **Cost by Appliance**: Monthly cost in INR/USD/EUR

Features:
- Color-coded bars for easy identification
- Hover tooltips with detailed info
- Sorted by highest consumption
- Responsive design

#### Appliance List
Full list of tracked appliances with:
- Real-time usage and cost calculations
- "Top Consumer" badge for highest energy user
- Quick edit and delete actions
- Detailed stats: Power, Daily Usage, Monthly Energy, Monthly Cost

### 3. **CRUD Operations**

#### Add Appliance
- Modal dialog with form
- Pre-filled templates for common appliances
- Real-time validation
- Success toast notification

#### Edit Appliance
- Same modal as add, pre-populated with existing data
- Updates reflected immediately in all charts
- Success confirmation

#### Delete Appliance
- Alert dialog confirmation
- Prevents accidental deletion
- Updates all calculations instantly

### 4. **Calculations**

All calculations are automatic and real-time:

```typescript
// Monthly Energy (kWh)
monthlyKWh = (powerWatts / 1000) × hoursPerDay × daysPerMonth

// Monthly Cost (₹)
monthlyCost = monthlyKWh × costPerKWh  // Default: ₹8/kWh

// Daily Usage
dailyKWh = (powerWatts / 1000) × hoursPerDay
```

### 5. **AI Insights Algorithm**

The system generates insights based on:

1. **Top Consumer Detection**: Appliance with highest kWh usage
2. **High Usage Pattern**: Appliances running >8 hours/day
3. **Total Consumption**: Optimization tips for >300 kWh/month
4. **Savings Calculation**: 10-20% based on usage patterns

Example Insights:
- "Your Air Conditioner consumes the most energy at 360 kWh/month. Consider reducing usage by 1-2 hours daily to save ₹432/month."
- "You have 2 appliance(s) running more than 8 hours daily. Optimizing their usage can save up to 15% on your bill."

### 6. **Data Persistence**

All data is stored in browser localStorage:

**Storage Keys:**
- `wattwise_appliances`: Array of appliance objects
- `wattwise_onboarding_complete`: Boolean flag

**Data Structure:**
```typescript
interface Appliance {
  id: string;              // UUID
  name: string;            // Appliance name
  powerWatts: number;      // Power in Watts
  hoursPerDay: number;     // Hours per day
  daysPerMonth: number;    // Days per month
  createdAt: string;       // ISO timestamp
}
```

## User Flow

### First-Time User
1. User logs in → Sees onboarding screen
2. Adds appliances (manually or via quick-add)
3. Clicks "Save & Continue"
4. Redirects to main dashboard with appliances tab

### Returning User
1. User logs in → Goes directly to dashboard
2. Can view appliance data in "My Appliances" tab
3. Can add/edit/delete appliances anytime
4. All changes persist across sessions

## Technical Implementation

### Component Architecture
```
App.tsx
├── ApplianceProvider (Context)
│   └── AppContent
│       ├── OnboardingPage (if !hasCompletedOnboarding)
│       └── DashboardPage
│           └── ApplianceManagementSection
│               ├── AddApplianceModal
│               ├── EditApplianceModal
│               ├── Charts (Recharts)
│               └── ApplianceList
```

### Key Files
- `/contexts/ApplianceContext.tsx` - Global appliance state
- `/lib/applianceTypes.ts` - Types and calculation functions
- `/components/OnboardingPage.tsx` - First-time setup
- `/components/ApplianceManagementSection.tsx` - Main management UI
- `/components/AddApplianceModal.tsx` - Add appliance dialog
- `/components/EditApplianceModal.tsx` - Edit appliance dialog

### State Management
Uses React Context API for global appliance state:
- `appliances`: Array of all appliances
- `addAppliance()`: Add new appliance
- `updateAppliance()`: Update existing appliance
- `deleteAppliance()`: Remove appliance
- `hasCompletedOnboarding`: Boolean flag
- `completeOnboarding()`: Mark onboarding complete

## Customization

### Change Cost Per kWh
Edit in `ApplianceManagementSection.tsx`:
```typescript
const costPerKWh = 8; // Change to your rate
```

### Add More Quick-Add Templates
Edit in `OnboardingPage.tsx`:
```typescript
const commonAppliances = [
  { name: 'Your Appliance', watts: 1000, hours: 5 },
  // Add more...
];
```

### Modify AI Insights
Edit in `lib/applianceTypes.ts`:
```typescript
export const generateApplianceInsights = (
  appliances: Appliance[],
  summary: ApplianceSummary
): string[] => {
  // Add your custom logic
};
```

## Future Enhancements

Possible improvements:
- [ ] Time-of-day tracking (peak vs off-peak hours)
- [ ] Historical appliance data with trends
- [ ] Smart scheduling recommendations
- [ ] Integration with smart home devices
- [ ] Comparison with similar households
- [ ] Energy star rating system
- [ ] Seasonal usage patterns
- [ ] Export appliance data to CSV
- [ ] Appliance replacement recommendations
- [ ] Carbon footprint per appliance

## Testing

### Manual Testing Checklist
- [ ] Onboarding shows on first login
- [ ] Can add appliances manually
- [ ] Quick-add buttons work
- [ ] Form validation works correctly
- [ ] Can add multiple appliances
- [ ] Can remove appliance rows
- [ ] Save & Continue redirects to dashboard
- [ ] Appliance data persists on refresh
- [ ] Can view appliances in dashboard tab
- [ ] Charts render correctly
- [ ] Can edit appliances
- [ ] Can delete appliances
- [ ] AI insights generate correctly
- [ ] Top consumer badge shows
- [ ] Calculations are accurate
- [ ] Responsive on mobile

### Edge Cases to Test
- Adding appliance with 0 watts
- Adding appliance with 25 hours/day (should fail)
- Deleting the last appliance
- Refreshing during onboarding
- Clearing localStorage
- Very long appliance names

## Troubleshooting

**Issue**: Onboarding doesn't show after login
- Check localStorage for `wattwise_onboarding_complete`
- Clear localStorage and try again

**Issue**: Appliances not persisting
- Check browser localStorage quota
- Ensure no localStorage errors in console

**Issue**: Charts not rendering
- Check Recharts is installed
- Verify appliance data structure

**Issue**: Calculations seem wrong
- Verify costPerKWh value (default ₹8)
- Check input values (Watts not kW)
- Ensure hours ≤ 24 and days ≤ 31

## Support

For issues or questions:
1. Check this documentation
2. Review inline code comments
3. Check browser console for errors
4. Verify localStorage data structure

## License

Same as main WattWise application (MIT)

---

**Built with ⚡ by WattWise Team**
