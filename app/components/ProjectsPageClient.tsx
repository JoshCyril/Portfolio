'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ProjectCardAnimated from './ProjectCardAnimated';
import { simpleProject, ProjectFilters } from '@/app/lib/interface';
import { staggerFadeUp } from '@/app/lib/animations';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ProjectsFilter from './ProjectsFilter';

interface Tag {
  tag_name: string;
  tag_url: any;
  tag_count: number;
}

interface ProjectsPageClientProps {
  initialProjects: simpleProject[];
  totalCount: number;
  tags: Tag[];
}

export default function ProjectsPageClient({ initialProjects, totalCount, tags }: ProjectsPageClientProps) {
  const [allProjects, setAllProjects] = useState<simpleProject[]>(initialProjects);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProjects.length < totalCount);
  const [filters, setFilters] = useState<ProjectFilters>({
    selectedTags: [],
    searchQuery: '',
    sortBy: 'date-desc',
    featuredOnly: false,
  });
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...allProjects];

    // Filter by tags
    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter((project) => {
        const projectTags = project.tags.map((tag) => tag.title);
        return filters.selectedTags.some((selectedTag) => projectTags.includes(selectedTag));
      });
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query)
      );
    }

    // Filter by featured
    if (filters.featuredOnly) {
      filtered = filtered.filter((project) => project.featured === true);
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-desc':
          return new Date(b.proDate).getTime() - new Date(a.proDate).getTime();
        case 'date-asc':
          return new Date(a.proDate).getTime() - new Date(b.proDate).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'featured-first':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.proDate).getTime() - new Date(a.proDate).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProjects, filters]);

  const loadMoreProjects = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const offset = allProjects.length;
      const response = await fetch(`/api/projects?offset=${offset}&limit=6`);
      const data = await response.json();

      if (data.projects && data.projects.length > 0) {
        setAllProjects((prev) => {
          const newProjects = [...prev, ...data.projects];
          setHasMore(newProjects.length < totalCount);
          return newProjects;
        });
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Track initial render
  const isInitialMount = useRef(true);
  const previousFilteredLength = useRef(filteredProjects.length);

  // Animate initial project cards with stagger and scroll trigger (only on mount)
  useEffect(() => {
    if (isInitialMount.current && cardsContainerRef.current && filteredProjects.length > 0) {
      isInitialMount.current = false;
      // Use requestAnimationFrame to ensure DOM is ready
      const rafId = requestAnimationFrame(() => {
        const cards = Array.from(cardsContainerRef.current?.querySelectorAll('[data-project-card]') || []).filter(
          (el): el is HTMLElement => el instanceof HTMLElement
        );
        if (cards.length > 0) {
          // Set initial opacity to 0 for all cards to prevent flash
          cards.forEach((card) => {
            gsap.set(card, { opacity: 0, y: 50 });
          });

          staggerFadeUp(cards, {
            duration: 0.6,
            stagger: 0.15,
            distance: 50,
            delay: 0.2, // 200ms delay
            scrollTrigger: {
              trigger: cardsContainerRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        }
      });

      return () => cancelAnimationFrame(rafId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate when filtered projects change (filters changed or new projects loaded)
  useEffect(() => {
    if (!isInitialMount.current && cardsContainerRef.current) {
      const rafId = requestAnimationFrame(() => {
        const cards = Array.from(cardsContainerRef.current?.querySelectorAll('[data-project-card]') || []).filter(
          (el): el is HTMLElement => el instanceof HTMLElement
        );

        if (cards.length > 0) {
          previousFilteredLength.current = filteredProjects.length;

          // Kill any existing animations on these cards
          cards.forEach((card) => {
            gsap.killTweensOf(card);
          });

          // Re-animate all visible cards
          cards.forEach((card) => {
            gsap.set(card, { opacity: 0, y: 30 });
          });

          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power2.out',
          });
        }
      });

      return () => cancelAnimationFrame(rafId);
    }
  }, [filteredProjects.length, allProjects.length]);

  return (
    <>
      {/* <div className="px-3 sticky top-0 md:top-28 z-30 mb-4"> */}
      <div className="px-3 mb-4">
        <ProjectsFilter tags={tags} filters={filters} onFiltersChange={setFilters} /></div>


      {filteredProjects.length > 0 ? (
        <>
          <div ref={cardsContainerRef} className="div flex flex-wrap py-3">
            {filteredProjects.map((project, idx) => (
              <ProjectCardAnimated
                key={`${project.slug}-${idx}`}
                {...project}
                isDimmed={hoveredCardIndex !== null && hoveredCardIndex !== idx}
                onMouseEnter={() => setHoveredCardIndex(idx)}
                onMouseLeave={() => setHoveredCardIndex(null)}
              />
            ))}
          </div>

          {/* Show Load More only if we haven't loaded all projects yet */}
          {hasMore && allProjects.length < totalCount && (
            <div className="flex w-full justify-center py-6">
              <Button
                ref={loadMoreButtonRef}
                onClick={loadMoreProjects}
                disabled={loading}
                variant="outline"
                className="min-w-32"
                enableRipple
                enableMagnetic
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}

          {/* Show filtered count */}
          {(filters.selectedTags.length > 0 || filters.searchQuery) && (
            <div className="text-center text-sm text-muted-foreground py-2">
              Showing {filteredProjects.length} of {allProjects.length} loaded project{allProjects.length !== 1 ? 's' : ''}
              {allProjects.length < totalCount && ` (${totalCount} total)`}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground mb-2">No projects match your filters</p>
          <Button
            variant="outline"
            onClick={() => {
              setFilters({
                selectedTags: [],
                searchQuery: '',
                sortBy: 'date-desc',
                featuredOnly: false,
              });
            }}
            enableRipple
            enableMagnetic
          >
            Clear Filters
          </Button>
        </div>
      )}
    </>
  );
}
