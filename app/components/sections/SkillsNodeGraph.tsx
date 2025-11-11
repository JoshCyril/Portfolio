'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { forceSimulation, forceManyBody, forceCenter, forceCollide, Simulation } from 'd3-force';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import { fadeUp } from '@/app/lib/animations';
import { urlFor } from '@/app/lib/sanity';
import { aboutNTag } from '@/app/lib/interface';

interface Node {
  id: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  tag_name: string;
  tag_count: number;
  tag_url: any;
  radius: number;
  imageUrl: string;
}

interface SkillsNodeGraphProps {
  data: aboutNTag;
}

export default function SkillsNodeGraph({ data }: SkillsNodeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<Simulation<Node, undefined> | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const nodeElementsRef = useRef<Map<string, { group: SVGGElement; image: SVGImageElement; text: SVGTextElement }>>(new Map());
  const [dimensions, setDimensions] = useState({ width: 500, height: 450 }); // Default dimensions
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1024, height: 768 }; // Default for SSR
  });

  // Track screen size changes to refresh graph
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Calculate responsive node sizes with max limit
  const nodes = useMemo(() => {
    if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) return [];

    // Calculate max and min counts, handling case where all tags might have 0 projects
    const counts = data.tags.map(t => t.tag_count);
    const maxCount = Math.max(...counts, 0);
    const minCount = Math.min(...counts, 0);
    const countRange = maxCount - minCount || 1; // Use 1 as fallback to avoid division by zero

    // Responsive base sizes - smaller on mobile
    // Use screenSize.width if available, otherwise default to desktop
    const width = screenSize.width > 0 ? screenSize.width : 1024;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    // Max radius limits based on screen size - smaller nodes
    const maxRadiusLimit = isMobile ? 24 : isTablet ? 28 : 32;
    const minRadius = isMobile ? 16 : isTablet ? 18 : 20;
    const sizeRange = maxRadiusLimit - minRadius;

    // Include all tags, including those with 0 projects
    return data.tags.map((tag, idx) => {
      // For 0-count tags, use minimum radius; otherwise size relative to project count
      // If all tags have the same count (including 0), all nodes will have minimum radius
      const normalizedCount = countRange > 0 ? (tag.tag_count - minCount) / countRange : 0;
      // Size relative to project count, capped at max limit
      const radius = Math.min(minRadius + normalizedCount * sizeRange, maxRadiusLimit);

      return {
        id: `node-${idx}`,
        x: 0,
        y: 0,
        tag_name: tag.tag_name,
        tag_count: tag.tag_count,
        tag_url: tag.tag_url,
        radius,
        imageUrl: urlFor(tag.tag_url).url(),
      };
    });
  }, [data.tags, screenSize.width]);

  // Update container dimensions - covers entire section and refreshes on screen size change
  useEffect(() => {
    if (!containerRef.current) {
      // Set default dimensions if container not ready
      setDimensions({ width: 500, height: 450 });
      return;
    }

    const updateDimensions = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      // Use full container size - get parent to cover entire section
      let width = rect.width;
      let height = rect.height;

      // Fallback to offset/client dimensions if getBoundingClientRect returns 0
      if (width === 0 || height === 0) {
        width = containerRef.current.offsetWidth || containerRef.current.clientWidth || 500;
        height = containerRef.current.offsetHeight || containerRef.current.clientHeight || 450;
      }

      // Get parent container to cover entire section
      const parent = containerRef.current.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const parentHeight = parentRect.height;
        // Use full parent height minus title and padding to cover entire section
        if (parentHeight > 0) {
          height = Math.max(height, parentHeight - 60); // Account for title (mb-4) and padding
        }
      }

      // Responsive height based on screen size - ensure full section coverage
      const widthForBreakpoint = screenSize.width > 0 ? screenSize.width : window.innerWidth || 1024;
      const isMobile = widthForBreakpoint < 768;
      const isTablet = widthForBreakpoint >= 768 && widthForBreakpoint < 1024;
      // Larger minimum heights to cover entire section
      const minHeight = isMobile ? 500 : isTablet ? 600 : 700;

      // Ensure minimum dimensions and use full available space
      const finalWidth = Math.max(width, 300);
      const finalHeight = Math.max(height, minHeight);

      if (finalWidth > 0 && finalHeight > 0) {
        setDimensions({ width: finalWidth, height: finalHeight });
      }
    };

    // Multiple attempts to get dimensions
    updateDimensions();

    // Use setTimeout to ensure DOM is ready
    const timeout1 = setTimeout(updateDimensions, 0);
    const timeout2 = setTimeout(updateDimensions, 100);
    const timeout3 = setTimeout(updateDimensions, 300);

    const rafId = requestAnimationFrame(() => {
      updateDimensions();
      requestAnimationFrame(updateDimensions);
    });

    // Update on resize
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateDimensions();
      }, 100);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [screenSize.width, screenSize.height]);

  // Store tooltip group reference to update without re-rendering
  const tooltipGroupRef = useRef<SVGGElement | null>(null);
  const tooltipTitleRef = useRef<SVGTextElement | null>(null);
  const tooltipCountRef = useRef<SVGTextElement | null>(null);
  const tooltipBgRef = useRef<SVGRectElement | null>(null);
  const hoveredNodeIdRef = useRef<string | null>(null);

  // Initialize and render nodes - refreshes when dimensions or screen size changes
  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) {
      return;
    }

    // Use dimensions, but fallback to defaults if invalid
    const width = dimensions.width > 0 ? dimensions.width : 500;
    const height = dimensions.height > 0 ? dimensions.height : 450;

    const svg = svgRef.current;

    // Stop previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }

    // Clear SVG
    svg.innerHTML = '';

    // Set SVG dimensions to cover entire section
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';

    // Create defs for clip paths
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    // Get theme colors from CSS variables for tooltip styling
    const getThemeColor = (varName: string) => {
      if (typeof window === 'undefined') return 'hsl(var(--popover))';
      const root = document.documentElement;
      const value = getComputedStyle(root).getPropertyValue(varName).trim();
      return value ? `hsl(${value})` : 'hsl(var(--popover))';
    };

    const popoverBg = getThemeColor('--popover');
    const popoverFg = getThemeColor('--popover-foreground');
    const mutedFg = getThemeColor('--muted-foreground');
    const borderColor = getThemeColor('--border');

    // Create tooltip group - store refs to update without re-rendering
    const tooltipGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tooltipGroup.setAttribute('class', 'tooltip-group');
    tooltipGroup.setAttribute('opacity', '0');
    tooltipGroup.setAttribute('pointer-events', 'none');
    tooltipGroupRef.current = tooltipGroup;

    const tooltipBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    tooltipBg.setAttribute('rx', '8');
    tooltipBg.setAttribute('ry', '8');
    tooltipBg.setAttribute('fill', popoverBg);
    tooltipBg.setAttribute('stroke', borderColor);
    tooltipBg.setAttribute('stroke-width', '1');
    tooltipBgRef.current = tooltipBg;

    const tooltipTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tooltipTitle.setAttribute('text-anchor', 'middle');
    tooltipTitle.setAttribute('fill', popoverFg);
    tooltipTitle.setAttribute('font-size', '14');
    tooltipTitle.setAttribute('font-weight', '600');
    tooltipTitle.setAttribute('dy', '0');
    tooltipTitle.setAttribute('x', '0');
    tooltipTitle.setAttribute('y', '0');
    tooltipTitleRef.current = tooltipTitle;

    const tooltipCount = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tooltipCount.setAttribute('text-anchor', 'middle');
    tooltipCount.setAttribute('fill', mutedFg);
    tooltipCount.setAttribute('font-size', '12');
    tooltipCount.setAttribute('font-weight', '400');
    tooltipCount.setAttribute('dy', '0');
    tooltipCount.setAttribute('x', '0');
    tooltipCount.setAttribute('y', '18');
    tooltipCountRef.current = tooltipCount;

    tooltipGroup.appendChild(tooltipBg);
    tooltipGroup.appendChild(tooltipTitle);
    tooltipGroup.appendChild(tooltipCount);
    svg.appendChild(tooltipGroup);

    // Create nodes group
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodesGroup.setAttribute('class', 'nodes-group');
    svg.appendChild(nodesGroup);

    // Initialize node positions - start extremely close to center for Obsidian-like clustering
    const initializedNodes: Node[] = nodes.map((node, idx) => {
      // Start nodes extremely close to center - they'll form a very tight Obsidian-like cluster
      const angle = (idx / nodes.length) * Math.PI * 2;
      const maxDistance = Math.min(width, height) * 0.03; // Even tighter initial spread
      const distance = maxDistance * (0.02 + Math.random() * 0.06); // Very small spread
      return {
        ...node,
        x: width / 2 + Math.cos(angle) * distance,
        y: height / 2 + Math.sin(angle) * distance,
      };
    });

    nodesRef.current = initializedNodes;
    nodeElementsRef.current.clear();

    // Create SVG elements for each node
    initializedNodes.forEach((node) => {
      // Create clip path for rounded images
      // Clip paths are defined in the defs and positioned relative to the node's transform
      const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clipPath.setAttribute('id', `clip-${node.id}`);
      const clipCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const clipRadius = node.radius * 1.6 / 2;
      clipCircle.setAttribute('r', clipRadius.toString());
      clipCircle.setAttribute('cx', '0');
      clipCircle.setAttribute('cy', '0');
      clipPath.appendChild(clipCircle);
      defs.appendChild(clipPath);

      // Create group for node
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'node-group');
      group.setAttribute('data-node-id', node.id);
      group.style.cursor = 'grab';

      // Create image - size based on radius
      const imageSize = node.radius * 1.6;
      const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      image.setAttribute('href', node.imageUrl);
      image.setAttribute('width', imageSize.toString());
      image.setAttribute('height', imageSize.toString());
      image.setAttribute('clip-path', `url(#clip-${node.id})`);
      image.style.cursor = 'grab';
      image.setAttribute('opacity', '1');
      image.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      // Create text label (hidden by default, shown on hover via tooltip)
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'currentColor');
      text.setAttribute('font-size', screenSize.width < 768 ? '10' : '11');
      text.setAttribute('font-weight', '600');
      text.setAttribute('pointer-events', 'none');
      text.setAttribute('dy', '0.35em');
      text.setAttribute('opacity', '0'); // Hidden, tooltip shows on hover
      text.textContent = node.tag_name;

      group.appendChild(image);
      group.appendChild(text);
      nodesGroup.appendChild(group);

      nodeElementsRef.current.set(node.id, { group, image, text });

      // Hover handlers - show tooltip with name and project count
      // Use refs directly instead of state to avoid re-rendering
      const showTooltip = () => {
        setHoveredNodeId(node.id);
        image.setAttribute('opacity', '0.8');

        // Bring node group to front (move to end of parent for highest z-index in SVG)
        if (group.parentNode) {
          group.parentNode.appendChild(group);
        }

        // Update tooltip content using refs
        if (tooltipTitleRef.current && tooltipCountRef.current && tooltipBgRef.current && tooltipGroupRef.current) {
          // Bring tooltip to front (move to end of SVG for highest z-index)
          if (tooltipGroupRef.current.parentNode) {
            tooltipGroupRef.current.parentNode.appendChild(tooltipGroupRef.current);
          }

          tooltipTitleRef.current.textContent = node.tag_name;
          // Show project count in tooltip
          tooltipCountRef.current.textContent = `${node.tag_count} ${node.tag_count === 1 ? 'project' : 'projects'}`;
          tooltipCountRef.current.setAttribute('opacity', '1');

          // Calculate tooltip dimensions (use temporary positioning)
          tooltipTitleRef.current.setAttribute('x', '0');
          tooltipTitleRef.current.setAttribute('y', '0');
          tooltipCountRef.current.setAttribute('x', '0');
          tooltipCountRef.current.setAttribute('y', '18');

          // Get bounding boxes for both title and count
          const titleBbox = tooltipTitleRef.current.getBBox();
          const countBbox = tooltipCountRef.current.getBBox();
          const tooltipWidth = Math.max(titleBbox.width, countBbox.width) + 24; // Padding
          const tooltipHeight = 44; // Height for title and count

          // Calculate safe zone - ensure tooltip doesn't get cut off
          const safeZone = 80; // Safe zone for tooltip at edges

          // Update tooltip colors to match current theme
          const updateTooltipColors = () => {
            if (typeof window === 'undefined') return;
            const root = document.documentElement;
            const popoverBg = `hsl(${getComputedStyle(root).getPropertyValue('--popover').trim()})`;
            const popoverFg = `hsl(${getComputedStyle(root).getPropertyValue('--popover-foreground').trim()})`;
            const mutedFg = `hsl(${getComputedStyle(root).getPropertyValue('--muted-foreground').trim()})`;
            const borderColor = `hsl(${getComputedStyle(root).getPropertyValue('--border').trim()})`;

            if (tooltipBgRef.current) {
              tooltipBgRef.current.setAttribute('fill', popoverBg);
              tooltipBgRef.current.setAttribute('stroke', borderColor);
            }
            if (tooltipTitleRef.current) {
              tooltipTitleRef.current.setAttribute('fill', popoverFg);
            }
            if (tooltipCountRef.current) {
              tooltipCountRef.current.setAttribute('fill', mutedFg);
            }
          };
          updateTooltipColors();

          // Position tooltip above node, but adjust if near edges
          let tooltipX = 0;
          let tooltipY = -tooltipHeight - node.radius - 12;

          // Check if tooltip would go outside bounds and adjust
          const nodeX = node.x;
          const nodeY = node.y;

          // Adjust horizontal position if near left/right edges
          if (nodeX - tooltipWidth / 2 < safeZone) {
            tooltipX = safeZone - nodeX + tooltipWidth / 2;
          } else if (nodeX + tooltipWidth / 2 > width - safeZone) {
            tooltipX = (width - safeZone) - nodeX - tooltipWidth / 2;
          }

          // Adjust vertical position if near top/bottom edges
          if (nodeY + tooltipY < safeZone) {
            // Move tooltip below node if too close to top
            tooltipY = node.radius + 12;
          } else if (nodeY + tooltipY + tooltipHeight > height - safeZone) {
            // Move tooltip above if too close to bottom
            tooltipY = -tooltipHeight - node.radius - 12;
          }

          // Position tooltip with safe zone consideration
          tooltipBgRef.current.setAttribute('x', (-tooltipWidth / 2 + tooltipX).toString());
          tooltipBgRef.current.setAttribute('y', tooltipY.toString());
          tooltipBgRef.current.setAttribute('width', tooltipWidth.toString());
          tooltipBgRef.current.setAttribute('height', tooltipHeight.toString());

          // Position title and count in tooltip
          tooltipTitleRef.current.setAttribute('x', tooltipX.toString());
          tooltipTitleRef.current.setAttribute('y', (tooltipY + 18).toString());
          tooltipCountRef.current.setAttribute('x', tooltipX.toString());
          tooltipCountRef.current.setAttribute('y', (tooltipY + 32).toString());
          tooltipCountRef.current.setAttribute('opacity', '1');

          tooltipGroupRef.current.setAttribute('opacity', '1');
        }
      };

      const hideTooltip = () => {
        setHoveredNodeId(null);
        image.setAttribute('opacity', '1');
        if (tooltipGroupRef.current) {
          tooltipGroupRef.current.setAttribute('opacity', '0');
        }
      };

      group.addEventListener('mouseenter', showTooltip);
      group.addEventListener('mouseleave', hideTooltip);
    });

    // Create drag behavior
    const dragBehavior = drag<SVGGElement, Node>()
      .on('start', function(event, d) {
        if (!event.active && simulationRef.current) {
          simulationRef.current.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
        select(this).raise().style('cursor', 'grabbing');
      })
      .on('drag', function(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', function(event, d) {
        if (!event.active && simulationRef.current) {
          simulationRef.current.alphaTarget(0);
        }
        setTimeout(() => {
          d.fx = null;
          d.fy = null;
        }, 100);
        select(this).style('cursor', 'grab');
      });

    // Apply drag to each group
    initializedNodes.forEach((node) => {
      const elements = nodeElementsRef.current.get(node.id);
      if (elements) {
        select(elements.group).datum(node).call(dragBehavior as any);
      }
    });

    // Create force simulation - Obsidian-like extremely tight clustering with minimal spreading
    const area = width * height;
    // Almost no repulsion - nodes stick together very tightly like Obsidian graph
    const chargeStrength = -Math.sqrt(area) * 0.02;
    const simulation = forceSimulation<Node>(initializedNodes)
      .force('charge', forceManyBody<Node>().strength(chargeStrength))
      // Extremely strong center force to keep nodes close to center
      .force('center', forceCenter(width / 2, height / 2).strength(0.8))
      // Minimal collision spacing - nodes stick together with very tiny gaps like Obsidian
      .force('collision', forceCollide<Node>().radius((d) => d.radius + 1).strength(0.98))
      .alphaDecay(0.012)
      .velocityDecay(0.75)
      .alpha(1)
      .restart();

    simulationRef.current = simulation;

    // Update positions on tick
    simulation.on('tick', () => {
      initializedNodes.forEach((node) => {
        const elements = nodeElementsRef.current.get(node.id);
        if (!elements) return;

        const { group, image, text } = elements;

        // Keep nodes within bounds with safe zone for tooltips, but allow tighter clustering
        // Safe zone ensures tooltips don't get cut off at edges
        const safeZone = 80; // Space reserved for tooltips
        const nodeMargin = 10; // Reduced margin for tighter clustering
        // Allow nodes to cluster more tightly towards center
        const centerX = width / 2;
        const centerY = height / 2;
        const maxDistanceFromCenter = Math.min(width, height) * 0.25; // Limit distance from center
        const distanceFromCenter = Math.sqrt((node.x - centerX) ** 2 + (node.y - centerY) ** 2);

        if (distanceFromCenter > maxDistanceFromCenter) {
          // Pull node back towards center if too far
          const angle = Math.atan2(node.y - centerY, node.x - centerX);
          node.x = centerX + Math.cos(angle) * maxDistanceFromCenter;
          node.y = centerY + Math.sin(angle) * maxDistanceFromCenter;
        }

        // Still respect safe zone boundaries
        node.x = Math.max(node.radius + nodeMargin + safeZone, Math.min(width - node.radius - nodeMargin - safeZone, node.x));
        node.y = Math.max(node.radius + nodeMargin + safeZone, Math.min(height - node.radius - nodeMargin - safeZone, node.y));

        // Update group transform
        group.setAttribute('transform', `translate(${node.x},${node.y})`);

        // Update image (centered in group)
        const imageSize = node.radius * 1.6;
        image.setAttribute('x', (-imageSize / 2).toString());
        image.setAttribute('y', (-imageSize / 2).toString());

        // Clip path is relative to the node's transform, so no need to update its position

        // Update text position (below image, hidden)
        text.setAttribute('x', '0');
        text.setAttribute('y', (node.radius + 20).toString());

        // Tooltip position is updated in a separate effect to avoid re-rendering
      });
    });

    // Cleanup
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
    };
  }, [nodes, dimensions, screenSize.width]); // Removed hoveredNodeId to prevent re-render on hover

  // Update ref when state changes to avoid closure issues
  useEffect(() => {
    hoveredNodeIdRef.current = hoveredNodeId;
  }, [hoveredNodeId]);

  // Update tooltip position when hovering - separate effect to avoid graph re-render
  useEffect(() => {
    if (!hoveredNodeId || !tooltipGroupRef.current || !tooltipBgRef.current || !tooltipTitleRef.current || !tooltipCountRef.current) {
      // Hide tooltip if no node is hovered
      if (tooltipGroupRef.current) {
        tooltipGroupRef.current.setAttribute('opacity', '0');
      }
      return;
    }

    let animationFrameId: number;
    let isActive = true;
    const width = dimensions.width;
    const height = dimensions.height;

    const updateTooltipPosition = () => {
      if (!isActive) return;

      const currentHoveredId = hoveredNodeIdRef.current;
      if (!currentHoveredId || !tooltipGroupRef.current || !tooltipBgRef.current || !tooltipTitleRef.current || !tooltipCountRef.current) {
        isActive = false;
        return;
      }

      const node = nodesRef.current.find(n => n.id === currentHoveredId);
      if (node && tooltipGroupRef.current && tooltipBgRef.current && tooltipTitleRef.current && tooltipCountRef.current) {
        // Bring tooltip to front on every update (move to end of SVG for highest z-index)
        if (tooltipGroupRef.current.parentNode) {
          tooltipGroupRef.current.parentNode.appendChild(tooltipGroupRef.current);
        }

        // Update tooltip colors to match current theme on every update
        if (typeof window !== 'undefined') {
          const root = document.documentElement;
          const popoverBg = `hsl(${getComputedStyle(root).getPropertyValue('--popover').trim()})`;
          const popoverFg = `hsl(${getComputedStyle(root).getPropertyValue('--popover-foreground').trim()})`;
          const mutedFg = `hsl(${getComputedStyle(root).getPropertyValue('--muted-foreground').trim()})`;
          const borderColor = `hsl(${getComputedStyle(root).getPropertyValue('--border').trim()})`;

          tooltipBgRef.current.setAttribute('fill', popoverBg);
          tooltipBgRef.current.setAttribute('stroke', borderColor);
          tooltipTitleRef.current.setAttribute('fill', popoverFg);
          tooltipCountRef.current.setAttribute('fill', mutedFg);
        }

        // Recalculate tooltip position with safe zone on every update
        const tooltipWidth = parseFloat(tooltipBgRef.current.getAttribute('width') || '100');
        const tooltipHeight = parseFloat(tooltipBgRef.current.getAttribute('height') || '44');
        const safeZone = 80;

        // Position tooltip above node, but adjust if near edges
        let tooltipX = 0;
        let tooltipY = -tooltipHeight - node.radius - 12;

        // Adjust horizontal position if near left/right edges
        if (node.x - tooltipWidth / 2 < safeZone) {
          tooltipX = safeZone - node.x + tooltipWidth / 2;
        } else if (node.x + tooltipWidth / 2 > width - safeZone) {
          tooltipX = (width - safeZone) - node.x - tooltipWidth / 2;
        }

        // Adjust vertical position if near top/bottom edges
        if (node.y + tooltipY < safeZone) {
          // Move tooltip below node if too close to top
          tooltipY = node.radius + 12;
        } else if (node.y + tooltipY + tooltipHeight > height - safeZone) {
          // Move tooltip above if too close to bottom (default position)
          tooltipY = -tooltipHeight - node.radius - 12;
        }

        // Update tooltip group transform (centered on node)
        tooltipGroupRef.current.setAttribute('transform', `translate(${node.x},${node.y})`);

        // Update tooltip element positions relative to group (with safe zone adjustments)
        tooltipBgRef.current.setAttribute('x', (-tooltipWidth / 2 + tooltipX).toString());
        tooltipBgRef.current.setAttribute('y', tooltipY.toString());
        // Position title and count
        tooltipTitleRef.current.setAttribute('x', tooltipX.toString());
        tooltipTitleRef.current.setAttribute('y', (tooltipY + 18).toString());
        tooltipCountRef.current.setAttribute('x', tooltipX.toString());
        tooltipCountRef.current.setAttribute('y', (tooltipY + 32).toString());
        tooltipCountRef.current.setAttribute('opacity', '1');
      }

      // Continue updating while hovering
      if (isActive) {
        animationFrameId = requestAnimationFrame(updateTooltipPosition);
      }
    };

    // Start updating
    animationFrameId = requestAnimationFrame(updateTooltipPosition);

    return () => {
      isActive = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [hoveredNodeId, dimensions.width, dimensions.height]);

  // Animate on scroll - but ensure visibility
  useEffect(() => {
    if (containerRef.current) {
      // Set initial opacity to handle cases where scroll trigger doesn't fire immediately
      const container = containerRef.current;

      fadeUp(container, {
        duration: 0.8,
        distance: 40,
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none none',
          onEnter: () => {
            // Ensure opacity is set when scroll trigger fires
            if (container) {
              container.style.opacity = '1';
            }
          },
        },
      });

      // Fallback: if element is already in view or after a delay, ensure it's visible
      const checkVisibility = () => {
        if (container) {
          const rect = container.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight * 0.8;
          if (isInView) {
            container.style.opacity = '1';
          }
        }
      };

      // Check after a short delay to allow scroll trigger to fire
      const timeout = setTimeout(() => {
        checkVisibility();
        // Also check on scroll
        window.addEventListener('scroll', checkVisibility, { once: true });
      }, 500);

      return () => {
        clearTimeout(timeout);
        window.removeEventListener('scroll', checkVisibility);
      };
    }
  }, []);

  // Show loading or empty state
  if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
    return (
      <div className="relative w-full h-full min-h-[400px] rounded-lg bg-secondary/30 flex items-center justify-center">
        <p className="text-muted-foreground">No skills to display</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-lg overflow-visible bg-transparent"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '600px',
      }}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'transparent',
          display: 'block',
          overflow: 'visible',
        }}
      />
    </div>
  );
}
