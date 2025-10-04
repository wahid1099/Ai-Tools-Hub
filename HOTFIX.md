# Hotfix: Function Declaration Order

## Issue

Application was crashing with errors:

- `ReferenceError: Cannot access 'w' before initialization`
- `ReferenceError: Cannot access 'o' before initialization`

## Root Cause

Functions were being referenced in `useEffect` dependency arrays before they were declared, causing JavaScript hoisting issues and circular dependencies.

### Affected Files:

1. `src/pages/Admin.tsx`
2. `src/pages/Bookmarks.tsx`

## Problems Identified

### Admin.tsx

```typescript
// ❌ WRONG - Function used before declaration
useEffect(() => {
  checkAuth();
}, [isAdmin, adminLoading]);

useEffect(() => {
  filterTools();
}, [tools, searchQuery, categoryFilter, filterTools]); // filterTools in deps!

const checkAuth = async () => { ... }
const filterTools = () => { ... }
```

### Bookmarks.tsx

```typescript
// ❌ WRONG - Function used before declaration
useEffect(() => {
  fetchBookmarkedTools();
}, [user, navigate, fetchBookmarkedTools]); // fetchBookmarkedTools in deps!

const fetchBookmarkedTools = async () => { ... }
```

## Solutions Applied

### Admin.tsx

```typescript
// ✅ CORRECT - Declare functions first
const checkAuth = async () => {
  if (adminLoading) return;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    navigate("/auth");
    return;
  }
  if (!isAdmin) {
    toast.error("You don't have admin access");
    navigate("/");
  }
};

const fetchTools = async () => {
  try {
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    setTools(data || []);
  } catch (error) {
    console.error("Error fetching tools:", error);
  } finally {
    setLoading(false);
  }
};

// Then use them in useEffects
useEffect(() => {
  checkAuth();
}, [isAdmin, adminLoading]);

useEffect(() => {
  if (isAdmin) {
    fetchTools();
  }
}, [isAdmin]);

// Inline the filter logic to avoid circular dependency
useEffect(() => {
  let filtered = tools;

  if (searchQuery) {
    filtered = filtered.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (categoryFilter !== "all") {
    filtered = filtered.filter((tool) => tool.category === categoryFilter);
  }

  setFilteredTools(filtered);
}, [tools, searchQuery, categoryFilter]); // No function in deps!
```

### Bookmarks.tsx

```typescript
// ✅ CORRECT - Declare function first
const fetchBookmarkedTools = async () => {
  if (!user) return;
  const { data, error } = await supabase
    .from("bookmarks")
    .select(
      `
      tool_id,
      tools (*)
    `
    )
    .eq("user_id", user.id);
  if (error) {
    console.error("Error fetching bookmarks:", error);
  } else {
    setTools(data?.map((b: any) => b.tools).filter(Boolean) || []);
  }
  setLoading(false);
};

const removeBookmark = async (toolId: string) => {
  if (!user) return;
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("tool_id", toolId);
  if (error) {
    toast.error("Failed to remove bookmark");
  } else {
    toast.success("Bookmark removed");
    setTools(tools.filter((tool) => tool.id !== toolId));
  }
};

// Then use in useEffect
useEffect(() => {
  if (!user) {
    navigate("/auth");
    return;
  }
  fetchBookmarkedTools();
}, [user, navigate]); // No function in deps!
```

## Key Learnings

### 1. Function Declaration Order

Always declare functions before using them in useEffect hooks.

### 2. Avoid Functions in Dependencies

Don't include function references in useEffect dependency arrays unless:

- They're wrapped in `useCallback`
- They're defined outside the component
- You understand the implications

### 3. Inline Logic When Possible

For simple filtering/transformation logic, inline it in the useEffect instead of creating a separate function.

### 4. ESLint Warnings

The warning "The 'X' function makes the dependencies of useEffect Hook change on every render" is a red flag.

## Testing Checklist

- [x] Admin dashboard loads without errors
- [x] Bookmarks page loads without errors
- [x] Search functionality works in admin
- [x] Category filter works in admin
- [x] Bookmarks can be removed
- [x] No console errors
- [x] No infinite re-render loops

## Prevention

To prevent this in the future:

1. **Use ESLint**: Pay attention to React Hooks warnings
2. **Use useCallback**: Wrap functions that need to be in dependencies
3. **Declare Early**: Define functions before useEffects
4. **Inline Simple Logic**: Don't create functions for simple operations

## Example Pattern

```typescript
// ✅ Good Pattern
const MyComponent = () => {
  const [data, setData] = useState([]);

  // 1. Declare functions first
  const fetchData = useCallback(async () => {
    const result = await api.getData();
    setData(result);
  }, []); // Dependencies here

  // 2. Use them in effects
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 3. Or inline simple logic
  useEffect(() => {
    const filtered = data.filter((item) => item.active);
    setFilteredData(filtered);
  }, [data]);

  return <div>...</div>;
};
```

---

**Status**: ✅ Fixed
**Date**: January 4, 2025
**Version**: 2.1.1
