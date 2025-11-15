'use client';

import { useRef, useEffect, useState } from 'react';
import { ProjectFilters, SkillTag } from '@/app/lib/interface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, X, ChevronDown, Tags } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/app/lib/sanity';
import { fadeUp } from '@/app/lib/animations';

interface ProjectsFilterProps {
  tags: SkillTag[];
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
}

export default function ProjectsFilter({ tags, filters, onFiltersChange }: ProjectsFilterProps) {
  const filterRef = useRef<HTMLDivElement>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);

  useEffect(() => {
    if (filterRef.current) {
      fadeUp(filterRef.current, {
        duration: 0.6,
        distance: 20,
        scrollTrigger: {
          trigger: filterRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, []);


  const toggleTag = (tagName: string) => {
    const newSelectedTags = filters.selectedTags.includes(tagName)
      ? filters.selectedTags.filter((t) => t !== tagName)
      : [...filters.selectedTags, tagName];

    onFiltersChange({
      ...filters,
      selectedTags: newSelectedTags,
    });
  };

  const clearAllTags = () => {
    onFiltersChange({
      ...filters,
      selectedTags: [],
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchQuery: e.target.value,
    });
  };

  const handleSortChange = (sortBy: ProjectFilters['sortBy']) => {
    onFiltersChange({
      ...filters,
      sortBy,
    });
  };

  const getSortLabel = () => {
    switch (filters.sortBy) {
      case 'date-desc':
        return 'Date: Newest';
      case 'date-asc':
        return 'Date: Oldest';
      case 'title-asc':
        return 'Title: A-Z';
      case 'title-desc':
        return 'Title: Z-A';
      case 'featured-first':
        return 'Featured First';
      default:
        return 'Sort';
    }
  };

  return (
    <div
      ref={filterRef}
      className="p-2 sticky top-0 md:top-28 z-30 mb-4 w-full bg-background/95 backdrop-blur-sm border-b border-border/40"
      style={{ opacity: 0 }}
    >
      <div className="flex flex-col gap-4">
        {/* Search and Controls Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4"
            />
            {/* {filters.searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => onFiltersChange({ ...filters, searchQuery: '' })}
                enableRipple
              >
                <X className="h-4 w-4" />
              </Button>
            )} */}
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu
            open={sortOpen}
            onOpenChange={(open) => {
              setSortOpen(open);
              if (open) {
                setTagsOpen(false);
              }
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:min-w-[140px] h-10 w-10 p-0 md:h-auto md:w-auto md:px-3 md:py-2">
                <Filter className="h-[14px] w-[14px] md:h-4 md:w-4 md:mr-2" />
                <span className="hidden md:inline">{getSortLabel()}</span>
                <ChevronDown className="hidden md:inline ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px] md:min-w-[8rem]">
              <DropdownMenuItem onClick={() => {
                handleSortChange('date-desc');
                setSortOpen(false);
              }} className="px-3 py-3 md:px-2 md:py-1.5 text-base md:text-sm min-h-[44px] md:min-h-0">
                Date: Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                handleSortChange('date-asc');
                setSortOpen(false);
              }} className="px-3 py-3 md:px-2 md:py-1.5 text-base md:text-sm min-h-[44px] md:min-h-0">
                Date: Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                handleSortChange('title-asc');
                setSortOpen(false);
              }} className="px-3 py-3 md:px-2 md:py-1.5 text-base md:text-sm min-h-[44px] md:min-h-0">
                Title: A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                handleSortChange('title-desc');
                setSortOpen(false);
              }} className="px-3 py-3 md:px-2 md:py-1.5 text-base md:text-sm min-h-[44px] md:min-h-0">
                Title: Z-A
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                handleSortChange('featured-first');
                setSortOpen(false);
              }} className="px-3 py-3 md:px-2 md:py-1.5 text-base md:text-sm min-h-[44px] md:min-h-0">
                Featured First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tags Dropdown */}
          {tags.length > 0 && (
            <DropdownMenu
              open={tagsOpen}
              onOpenChange={(open) => {
                setTagsOpen(open);
                if (open) {
                  setSortOpen(false);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="md:min-w-[140px] h-10 w-10 p-0 md:h-auto md:w-auto md:px-3 md:py-2 relative">
                  <Tags className="h-[14px] w-[14px] md:h-4 md:w-4 md:mr-2" />
                  <span className="hidden md:inline">Technologies</span>
                  {filters.selectedTags.length > 0 && (
                    <>
                      <span className="hidden md:inline ml-2 rounded-full bg-primary text-primary-foreground px-1.5 py-0.5 text-xs">
                        {filters.selectedTags.length}
                      </span>
                      <span className="md:hidden absolute -top-1 -right-1 rounded-full bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center">
                        {filters.selectedTags.length}
                      </span>
                    </>
                  )}
                  <ChevronDown className="hidden md:inline ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 md:w-56 max-h-[400px] overflow-y-auto">
                <DropdownMenuLabel className="px-3 py-2 md:px-2 md:py-1.5 text-base md:text-sm">Filter by Technology</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filters.selectedTags.length > 0 && (
                  <>
                    <DropdownMenuItem
                      onClick={clearAllTags}
                      className="text-muted-foreground px-3 py-3 md:px-2 md:py-1.5 text-base md:text-sm min-h-[44px] md:min-h-0"
                    >
                      <X className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                      Clear all tags
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {tags.map((tag) => {
                  const isSelected = filters.selectedTags.includes(tag.tag_name);
                  return (
                    <DropdownMenuCheckboxItem
                      key={tag.tag_name}
                      checked={isSelected}
                      onCheckedChange={() => toggleTag(tag.tag_name)}
                      className="flex items-center gap-2 py-3 md:py-1.5 pl-10 md:pl-8 pr-3 md:pr-2 text-base md:text-sm min-h-[44px] md:min-h-0"
                    >
                      {tag.tag_url && (
                        <Image
                          src={urlFor(tag.tag_url).url()}
                          alt={tag.tag_name}
                          width={20}
                          height={20}
                          className="rounded-sm md:w-4 md:h-4"
                        />
                      )}
                      <span className="flex-1">{tag.tag_name}</span>
                      <span className="text-sm md:text-xs text-muted-foreground">
                        ({tag.tag_count})
                      </span>
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
