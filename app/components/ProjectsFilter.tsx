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
    //   case 'date-desc':
    //     return 'Date: Newest';
    //   case 'date-asc':
    //     return 'Date: Oldest';
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
      className="sticky top-0 z-30 mb-4 w-full border-b border-border/40 bg-background/95 p-2 backdrop-blur-sm md:top-28"
      style={{ opacity: 0 }}
    >
      <div className="flex flex-col gap-4">
        {/* Search and Controls Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
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
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 transform"
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
              <Button variant="outline" size="icon" className="h-10 w-10 p-0 md:h-auto md:w-auto md:min-w-[140px] md:px-3 md:py-2">
                <Filter className="h-[14px] w-[14px] md:mr-2 md:h-4 md:w-4" />
                <span className="hidden md:inline">{getSortLabel()}</span>
                <ChevronDown className="ml-2 hidden h-4 w-4 md:inline" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px] md:min-w-[8rem]">
              {/* <DropdownMenuItem onClick={() => {
                handleSortChange('date-desc');
                setSortOpen(false);
              }} className="min-h-[44px] px-3 py-3 text-base md:min-h-0 md:px-2 md:py-1.5 md:text-sm">
                Date: Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                handleSortChange('date-asc');
                setSortOpen(false);
              }} className="min-h-[44px] px-3 py-3 text-base md:min-h-0 md:px-2 md:py-1.5 md:text-sm">
                Date: Oldest
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => {
                handleSortChange('title-asc');
                setSortOpen(false);
              }} className="min-h-[44px] px-3 py-3 text-base md:min-h-0 md:px-2 md:py-1.5 md:text-sm">
                Title: A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                handleSortChange('title-desc');
                setSortOpen(false);
              }} className="min-h-[44px] px-3 py-3 text-base md:min-h-0 md:px-2 md:py-1.5 md:text-sm">
                Title: Z-A
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                handleSortChange('featured-first');
                setSortOpen(false);
              }} className="min-h-[44px] px-3 py-3 text-base md:min-h-0 md:px-2 md:py-1.5 md:text-sm">
                Featured
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
                <Button variant="outline" size="icon" className="relative h-10 w-10 p-0 md:h-auto md:w-auto md:min-w-[140px] md:px-3 md:py-2">
                  <Tags className="h-[14px] w-[14px] md:mr-2 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Technologies</span>
                  {filters.selectedTags.length > 0 && (
                    <>
                      <span className="ml-2 hidden rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground md:inline">
                        {filters.selectedTags.length}
                      </span>
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground md:hidden">
                        {filters.selectedTags.length}
                      </span>
                    </>
                  )}
                  <ChevronDown className="ml-2 hidden h-4 w-4 md:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-[400px] w-64 overflow-y-auto md:w-56">
                <DropdownMenuLabel className="px-3 py-2 text-base md:px-2 md:py-1.5 md:text-sm">Filter by Technology</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filters.selectedTags.length > 0 && (
                  <>
                    <DropdownMenuItem
                      onClick={clearAllTags}
                      className="min-h-[44px] px-3 py-3 text-base text-muted-foreground md:min-h-0 md:px-2 md:py-1.5 md:text-sm"
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
                      className="flex min-h-[44px] items-center gap-2 py-3 pl-10 pr-3 text-base md:min-h-0 md:py-1.5 md:pl-8 md:pr-2 md:text-sm"
                    >
                      {tag.tag_url && (
                        <Image
                          src={urlFor(tag.tag_url).url()}
                          alt={tag.tag_name}
                          width={20}
                          height={20}
                          className="rounded-sm md:h-4 md:w-4"
                          loading="lazy"
                        />
                      )}
                      <span className="flex-1">{tag.tag_name}</span>
                      <span className="text-sm text-muted-foreground md:text-xs">
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
