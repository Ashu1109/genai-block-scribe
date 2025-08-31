import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { Search, Filter, Grid, List } from "lucide-react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "GenAI" | "Blockchain">("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const categoryCount = {
    All: blogPosts.length,
    GenAI: blogPosts.filter(post => post.category === "GenAI").length,
    Blockchain: blogPosts.filter(post => post.category === "Blockchain").length
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Tech Blog
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the latest insights in Generative AI and Blockchain technology
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-3 bg-secondary/50 border-border focus:ring-primary text-lg"
            />
          </div>

          {/* Category Filters and View Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <div className="flex space-x-2">
                {(["All", "GenAI", "Blockchain"] as const).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={`${
                      selectedCategory === category 
                        ? "bg-gradient-primary text-primary-foreground shadow-glow" 
                        : "hover:border-primary hover:text-primary"
                    }`}
                  >
                    {category}
                    <span className="ml-2 text-xs bg-background/20 px-2 py-1 rounded-full">
                      {categoryCount[category]}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <p className="text-muted-foreground text-center">
            Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div 
            className={`${
              viewMode === "grid" 
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" 
                : "space-y-6"
            }`}
          >
            {filteredPosts.map((post) => (
              <div key={post.id} className={viewMode === "list" ? "max-w-4xl mx-auto" : ""}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or category filter
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredPosts.length > 0 && filteredPosts.length >= 9 && (
          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;