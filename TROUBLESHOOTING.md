# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### Blank White Page

If you're seeing a blank white page, try these steps:

1. **Check Browser Console**

   - Open Developer Tools (F12)
   - Look for error messages in the Console tab
   - Common errors and fixes below

2. **Clear Browser Cache**

   ```bash
   # Hard refresh
   Ctrl + Shift + R (Windows/Linux)
   Cmd + Shift + R (Mac)
   ```

3. **Check Environment Variables**

   - Ensure `.env` file exists in root directory
   - Verify Supabase credentials are correct

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Restart Development Server**
   ```bash
   # Stop the server (Ctrl + C)
   # Clear node_modules and reinstall
   rm -rf node_modules
   npm install
   npm run dev
   ```

### Database Connection Issues

**Error: "The schema must be one of the following: public, graphql_public"**

Solution: The database schema is set to "public" by default. If you see this error:

- Check `src/integrations/supabase/client.ts`
- Ensure it's NOT using a custom schema
- The client should look like this:

```typescript
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
```

### TypeScript Errors

**Error: Type errors in components**

Solution:

```bash
# Regenerate Supabase types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

### Theme Not Working

**Issue: Dark mode toggle not working**

Solution:

1. Check if `theme-provider.tsx` is properly imported in `App.tsx`
2. Verify localStorage is enabled in your browser
3. Clear localStorage:

```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Animations Not Showing

**Issue: No animations or transitions**

Solution:

1. Ensure Framer Motion is installed:

```bash
npm install framer-motion
```

2. Check if CSS animations are defined in `index.css`

### Visitor Tracking Not Working

**Issue: Analytics not showing visitors**

Solution:

1. Check if `page_visits` table exists in Supabase
2. Verify table has `visitor_ip` column
3. Check browser console for CORS errors
4. Ensure IP API is accessible:

```javascript
// Test in browser console
fetch("https://api.ipify.org?format=json")
  .then((r) => r.json())
  .then(console.log);
```

### Build Errors

**Error during `npm run build`**

Solution:

```bash
# Clean build
rm -rf dist
npm run build

# If still failing, check for:
# 1. Unused imports
# 2. Type errors
# 3. Missing dependencies
```

### Performance Issues

**Issue: Slow loading or laggy animations**

Solution:

1. Reduce animation delays in components
2. Optimize images (use WebP format)
3. Enable lazy loading for images
4. Check network tab for slow API calls

### Supabase RLS Issues

**Error: "Row Level Security policy violation"**

Solution:

1. Check RLS policies in Supabase dashboard
2. Ensure policies allow:
   - Public read access for tools
   - Authenticated user access for bookmarks
   - Admin access for management

Example policy for tools table:

```sql
-- Allow public read
CREATE POLICY "Allow public read access"
ON tools FOR SELECT
TO public
USING (true);

-- Allow authenticated insert
CREATE POLICY "Allow authenticated insert"
ON tools FOR INSERT
TO authenticated
WITH CHECK (true);
```

### Module Not Found Errors

**Error: "Cannot find module '@/components/...'"**

Solution:

1. Check `tsconfig.json` has correct path mapping:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. Restart TypeScript server in VS Code:
   - Cmd/Ctrl + Shift + P
   - "TypeScript: Restart TS Server"

### API Rate Limiting

**Issue: Too many requests to IP API**

Solution:

- The visitor tracking already implements deduplication
- If still hitting limits, consider:
  1. Using a different IP service
  2. Caching IP addresses
  3. Implementing server-side tracking

## Getting Help

If none of these solutions work:

1. **Check GitHub Issues**

   - Search for similar problems
   - Create a new issue with:
     - Error message
     - Browser console logs
     - Steps to reproduce

2. **Enable Debug Mode**

   ```typescript
   // Add to App.tsx
   console.log("App loaded");
   console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
   ```

3. **Test Components Individually**
   - Comment out sections to isolate the issue
   - Start with basic components
   - Add complexity gradually

## Useful Commands

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Clear npm cache
npm cache clean --force

# Verify installation
npm list

# Check for security issues
npm audit

# Fix security issues
npm audit fix
```

## Browser Compatibility

Tested and working on:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

If using older browsers, some features may not work.

## Development Tips

1. **Use React DevTools**

   - Install React Developer Tools extension
   - Inspect component state and props

2. **Monitor Network Requests**

   - Open Network tab in DevTools
   - Check for failed requests
   - Verify API responses

3. **Check Supabase Logs**

   - Go to Supabase Dashboard
   - Check Logs section
   - Look for database errors

4. **Enable Verbose Logging**
   ```typescript
   // In supabase client
   const supabase = createClient(url, key, {
     auth: {
       debug: true,
     },
   });
   ```

---

Still having issues? Open an issue on GitHub with detailed information!
