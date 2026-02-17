

import "./style.scss";
import { useAuth } from "../../context/AuthContext";  // adjust path as needed
import Categories from "./Categories";
// ✅ forward props into Categories (including onSearch)
export default function SidebarLeft({ onCategorySelect, selectedCategory, onSearch }) {
  const { user: loggedInUser, isAuth, fullUserData, hasActiveSubscription } = useAuth();

  return (
    <aside className="sidebar-left">
      <Categories
        onCategorySelect={onCategorySelect}
        selectedCategory={selectedCategory}
        onSearch={onSearch} 
      />
  
      {/* <DiscussionNow /> */}
    </aside>
  );
}
