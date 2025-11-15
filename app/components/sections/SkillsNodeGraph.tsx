'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { forceSimulation, forceManyBody, forceCenter, forceCollide, Simulation } from 'd3-force';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import { fadeUp } from '@/app/lib/animations';
import { urlFor } from '@/app/lib/sanity';
import { AboutWithTags } from '@/app/lib/interface';

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
  data: AboutWithTags;
}

export default function SkillsNodeGraph({ data }: SkillsNodeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<Simulation<Node, undefined> | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const nodeElementsRef = useRef<Map<string, { group: SVGGElement; image: HTMLImageElement; text: SVGTextElement; foreignObject: SVGForeignObjectElement }>>(new Map());
  const [dimensions, setDimensions] = useState({ width: 500, height: 450 }); // Default dimensions
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 }); // Deterministic default for SSR/CSR

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

    // Responsive base sizes with 4x ratio
    // Use screenSize.width if available, otherwise default to desktop
    const width = screenSize.width > 0 ? screenSize.width : 1024;
    const isMobile = width < 768; // xl: mobile
    const isTablet = width >= 768 && width < 1024; // 2xl: tablet
    // Desktop is 3xl (>= 1024)

    // Max radius limits based on screen size - max 32px for all screens
    // Mobile (xl): max radius 32px, min 12px
    // Tablet (2xl): max radius 32px, min 12px
    // Desktop (3xl): max radius 32px, min 12px
    const maxRadiusLimit = 32; // Maximum radius 32px for all screen sizes
    const minRadius = 12; // Minimum radius 12px for all screen sizes
    const sizeRange = maxRadiusLimit - minRadius;

    // Include all tags, including those with 0 projects
    return data.tags.map((tag, idx) => {
      // For 0-count tags, use minimum radius; otherwise size relative to project count
      // If all tags have the same count (including 0), all nodes will have minimum radius
      const normalizedCount = countRange > 0 ? (tag.tag_count - minCount) / countRange : 0;
      // Exponential scaling - makes larger nodes more prominent
      // Use exponential function: e^(normalizedCount * scalingFactor) - 1, then normalize
      const exponentialFactor = Math.exp(normalizedCount * 2) - 1; // e^(2x) - 1 gives exponential curve
      const maxExponential = Math.exp(1 * 2) - 1; // Maximum value when normalizedCount = 1
      const exponentialNormalized = maxExponential > 0 ? exponentialFactor / maxExponential : 0;
      // Size relative to project count with exponential scaling, capped at max limit
      const radius = Math.min(minRadius + exponentialNormalized * sizeRange, maxRadiusLimit);

      return {
        id: `node-${idx}`,
        x: 0,
        y: 0,
        tag_name: tag.tag_name,
        tag_count: tag.tag_count,
        tag_url: tag.tag_url,
        radius,
        imageUrl: tag.tag_url ? urlFor(tag.tag_url).url() : '',
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

      // Get parent container (flex-1 w-full div) - this is the actual container for the graph
      const parent = containerRef.current.parentElement;
      if (!parent) {
        // Fallback to container's own dimensions
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width || containerRef.current.offsetWidth || 500,
          height: rect.height || containerRef.current.offsetHeight || 450
        });
        return;
      }

      // Get parent's dimensions - use full dimensions without padding subtraction
      const parentRect = parent.getBoundingClientRect();
      let width = parentRect.width;
      let height = parentRect.height;

      // Fallback if getBoundingClientRect returns 0
      if (width === 0 || height === 0) {
        width = parent.clientWidth || parent.offsetWidth || 500;
        height = parent.clientHeight || parent.offsetHeight || 450;
      }

      // Use full container dimensions - no padding subtraction
      // The viewBox should match the container exactly
      const finalWidth = Math.max(width, 300);

      // Responsive dimensions based on screen size
      const widthForBreakpoint = screenSize.width > 0 ? screenSize.width : (typeof window !== 'undefined' ? window.innerWidth : 1024);
      const isMobile = widthForBreakpoint < 768;
      const isTablet = widthForBreakpoint >= 768 && widthForBreakpoint < 1024;

      // Height should use the parent's height, but ensure minimum for each breakpoint
      const finalHeight = Math.max(height, isMobile ? 400 : isTablet ? 500 : 600);

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
      // Also observe parent container to catch size changes
      const parent = containerRef.current.parentElement;
      if (parent) {
        resizeObserver.observe(parent);
      }
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

    // Get actual container dimensions for viewBox to fully cover the div
    // Use getBoundingClientRect for most accurate measurements
    const containerRect = containerRef.current?.getBoundingClientRect();
    const containerWidth = containerRect?.width || dimensions.width || 500;
    const containerHeight = containerRect?.height || dimensions.height || 450;

    // Ensure we have valid dimensions
    if (containerWidth <= 0 || containerHeight <= 0) {
      return;
    }

    const svg = svgRef.current;

    // Stop previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }

    // Clear SVG
    svg.innerHTML = '';

    // Set SVG dimensions to cover entire section - viewBox matches container exactly
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
    svg.setAttribute('preserveAspectRatio', 'none'); // Allow stretching to fully cover
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';

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
    // Add smooth transitions for opacity - SVG elements support CSS transitions on opacity
    tooltipGroup.style.transition = 'opacity 0.15s ease-out';
    tooltipGroup.style.willChange = 'opacity, transform';
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

    // Initialize node positions - start close to center for relaxed Obsidian-like clustering
    const initializedNodes: Node[] = nodes.map((node, idx) => {
      // Start nodes near center - they'll cluster naturally through force simulation
      // Use moderate spread to prevent initial overlap and glitching
      const angle = (idx / nodes.length) * Math.PI * 2;
      const maxDistance = Math.min(containerWidth, containerHeight) * 0.15; // Moderate initial spread
      const distance = maxDistance * (0.4 + Math.random() * 0.4); // Moderate variation
      return {
        ...node,
        x: containerWidth / 2 + Math.cos(angle) * distance,
        y: containerHeight / 2 + Math.sin(angle) * distance,
      };
    });

    nodesRef.current = initializedNodes;
    nodeElementsRef.current.clear();

    // Create SVG elements for each node
    initializedNodes.forEach((node) => {
      // Calculate image size first
      const imageSize = node.radius * 1.6;

      // Create group for node
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'node-group');
      group.setAttribute('data-node-id', node.id);
      group.style.cursor = 'grab';

      // Use foreignObject to embed HTML img with rounded-md class
      // This allows us to use Tailwind CSS classes for rounded corners
      const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      foreignObject.setAttribute('width', imageSize.toString());
      foreignObject.setAttribute('height', imageSize.toString());
      foreignObject.setAttribute('x', (-imageSize / 2).toString());
      foreignObject.setAttribute('y', (-imageSize / 2).toString());

      // Create HTML img element with rounded-md class
      const img = document.createElement('img');
      img.src = node.imageUrl;
      img.className = 'rounded-md';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.cursor = 'grab';
      img.style.opacity = '0.5';
      img.style.filter = 'grayscale(100%)'; // Start with grayscale (black and white) by default
      img.style.transition = 'filter 0.3s ease, opacity 0.3s ease'; // Smooth transition for grayscale effect
      img.setAttribute('draggable', 'false');

      foreignObject.appendChild(img);
      group.appendChild(foreignObject);

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

      group.appendChild(text);
      nodesGroup.appendChild(group);

      nodeElementsRef.current.set(node.id, { group, image: img, text, foreignObject });

      // Hover handlers - update node visuals and set hover state
      // Tooltip display and positioning is handled by the useEffect
      const showTooltip = () => {
        setHoveredNodeId(node.id);

        // Remove grayscale from hovered node to reveal color
        img.style.filter = 'grayscale(0%)';
        img.style.opacity = '1';

        // Keep other nodes grayscale and slightly reduce opacity
        nodeElementsRef.current.forEach((elements, nodeId) => {
          if (nodeId !== node.id && elements.image) {
            elements.image.style.filter = 'grayscale(100%)';
            elements.image.style.opacity = '0.5'; // Reduce opacity for non-active nodes
          }
        });

        // Bring node group to front (move to end of parent for highest z-index in SVG)
        if (group.parentNode) {
          group.parentNode.appendChild(group);
        }

        // Update tooltip content using refs - this happens immediately for instant text update
        if (tooltipTitleRef.current && tooltipCountRef.current && tooltipBgRef.current) {
          tooltipTitleRef.current.textContent = node.tag_name;
          // Show project count in tooltip only if count > 0
          const showCount = node.tag_count > 0;
          if (showCount) {
            tooltipCountRef.current.textContent = `${node.tag_count} ${node.tag_count === 1 ? 'project' : 'projects'}`;
          } else {
            tooltipCountRef.current.textContent = '';
          }

          // Calculate tooltip dimensions for initial sizing
          tooltipTitleRef.current.setAttribute('x', '0');
          tooltipTitleRef.current.setAttribute('y', '0');
          tooltipCountRef.current.setAttribute('x', '0');
          tooltipCountRef.current.setAttribute('y', '18');

          // Get bounding boxes - adjust based on whether count is shown
          const titleBbox = tooltipTitleRef.current.getBBox();
          const countBbox = showCount ? tooltipCountRef.current.getBBox() : { width: 0 };
          const tooltipWidth = Math.max(titleBbox.width, countBbox.width) + 24; // Padding
          const tooltipHeight = showCount ? 44 : 32; // Height for title only or title + count

          // Set initial tooltip size
          tooltipBgRef.current.setAttribute('width', tooltipWidth.toString());
          tooltipBgRef.current.setAttribute('height', tooltipHeight.toString());
        }
      };

      const hideTooltip = () => {
        setHoveredNodeId(null);

        // Restore grayscale to hovered node (back to black and white)
        img.style.filter = 'grayscale(100%)';
        img.style.opacity = '0.5';

        // Restore all nodes to grayscale with full opacity
        nodeElementsRef.current.forEach((elements) => {
          if (elements.image) {
            elements.image.style.filter = 'grayscale(100%)';
            elements.image.style.opacity = '0.5';
          }
        });
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

    // Create force simulation - Relaxed Obsidian-like clustering without glitching
    const area = containerWidth * containerHeight;
    // Very weak repulsion - allows nodes to cluster but prevents glitching
    const chargeStrength = -Math.sqrt(area) * 0.008;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const simulation = forceSimulation<Node>(initializedNodes)
      .force('charge', forceManyBody<Node>().strength(chargeStrength))
      // Moderate center force to keep nodes clustered at center without being too aggressive
      .force('center', forceCenter(centerX, centerY).strength(0.7))
      // Relaxed collision spacing - prevents overlap without being too tight
      .force('collision', forceCollide<Node>().radius((d) => d.radius + 4).strength(0.8))
      .alphaDecay(0.022) // Normal decay for smooth settling
      .velocityDecay(0.4) // Lower damping for more natural, relaxed motion
      .alpha(1)
      .restart();

    simulationRef.current = simulation;

    // Update positions on tick
    simulation.on('tick', () => {
      initializedNodes.forEach((node) => {
        const elements = nodeElementsRef.current.get(node.id);
        if (!elements) return;

        const { group, image, text } = elements;

        // Use full viewBox dimensions - no padding, no safe zones
        // Only keep nodes within bounds based on node radius to prevent clipping
        const minX = node.radius;
        const maxX = containerWidth - node.radius;
        const minY = node.radius;
        const maxY = containerHeight - node.radius;

        // Clamp to boundaries if outside
        if (node.x < minX) node.x = minX;
        if (node.x > maxX) node.x = maxX;
        if (node.y < minY) node.y = minY;
        if (node.y > maxY) node.y = maxY;

        // Update group transform
        group.setAttribute('transform', `translate(${node.x},${node.y})`);

        // foreignObject positioning is set during creation and doesn't need updating
        // The transform on the group handles the node's position

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
  }, [nodes, dimensions.width, dimensions.height, screenSize.width]); // Include dimensions to update viewBox on resize

  // Update ref when state changes to avoid closure issues
  useEffect(() => {
    hoveredNodeIdRef.current = hoveredNodeId;
  }, [hoveredNodeId]);

  // Update tooltip position when hovering - separate effect to avoid graph re-render
  useEffect(() => {
    if (!hoveredNodeId || !tooltipGroupRef.current || !tooltipBgRef.current || !tooltipTitleRef.current || !tooltipCountRef.current) {
      // Hide tooltip if no node is hovered with smooth fade-out
      if (tooltipGroupRef.current) {
        tooltipGroupRef.current.style.opacity = '0';
        tooltipGroupRef.current.setAttribute('opacity', '0');
      }
      return;
    }

    let animationFrameId: number;
    let isActive = true;
    let lastX = 0;
    let lastY = 0;
    // Smooth interpolation for position updates - creates fluid following effect
    const smoothingFactor = 0.2; // Lower = smoother but slower, higher = more responsive

    // Get actual container dimensions for tooltip positioning
    const containerRect = containerRef.current?.getBoundingClientRect();
    const width = containerRect?.width || dimensions.width;
    const height = containerRect?.height || dimensions.height;

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

        // Update tooltip content
        tooltipTitleRef.current.textContent = node.tag_name;
        const showCount = node.tag_count > 0;
        if (showCount) {
          tooltipCountRef.current.textContent = `${node.tag_count} ${node.tag_count === 1 ? 'project' : 'projects'}`;
        } else {
          tooltipCountRef.current.textContent = '';
        }

        // Recalculate tooltip dimensions
        tooltipTitleRef.current.setAttribute('x', '0');
        tooltipTitleRef.current.setAttribute('y', '0');
        tooltipCountRef.current.setAttribute('x', '0');
        tooltipCountRef.current.setAttribute('y', '18');
        const titleBbox = tooltipTitleRef.current.getBBox();
        const countBbox = showCount ? tooltipCountRef.current.getBBox() : { width: 0 };
        const tooltipWidth = Math.max(titleBbox.width, countBbox.width) + 24;
        const tooltipHeight = showCount ? 44 : 32;
        tooltipBgRef.current.setAttribute('width', tooltipWidth.toString());
        tooltipBgRef.current.setAttribute('height', tooltipHeight.toString());

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

        // Smooth position interpolation for fluid movement
        lastX = lastX + (node.x - lastX) * smoothingFactor;
        lastY = lastY + (node.y - lastY) * smoothingFactor;

        // Recalculate tooltip position with safe zone on every update
        const safeZone = 80;

        // Position tooltip above node, but adjust if near edges
        let tooltipX = 0;
        let tooltipY = -tooltipHeight - node.radius - 12;

        // Adjust horizontal position if near left/right edges (use smoothed position)
        if (lastX - tooltipWidth / 2 < safeZone) {
          tooltipX = safeZone - lastX + tooltipWidth / 2;
        } else if (lastX + tooltipWidth / 2 > width - safeZone) {
          tooltipX = (width - safeZone) - lastX - tooltipWidth / 2;
        }

        // Adjust vertical position if near top/bottom edges (use smoothed position)
        if (lastY + tooltipY < safeZone) {
          // Move tooltip below node if too close to top
          tooltipY = node.radius + 12;
        } else if (lastY + tooltipY + tooltipHeight > height - safeZone) {
          // Move tooltip above if too close to bottom (default position)
          tooltipY = -tooltipHeight - node.radius - 12;
        }

        // Update tooltip group transform with smoothed position (centered on node)
        tooltipGroupRef.current.setAttribute('transform', `translate(${lastX},${lastY})`);

        // Update tooltip element positions relative to group (with safe zone adjustments)
        tooltipBgRef.current.setAttribute('x', (-tooltipWidth / 2 + tooltipX).toString());
        tooltipBgRef.current.setAttribute('y', tooltipY.toString());
        // Position title and count based on whether count is shown
        if (showCount) {
          tooltipTitleRef.current.setAttribute('x', tooltipX.toString());
          tooltipTitleRef.current.setAttribute('y', (tooltipY + 18).toString());
          tooltipCountRef.current.setAttribute('x', tooltipX.toString());
          tooltipCountRef.current.setAttribute('y', (tooltipY + 32).toString());
          tooltipCountRef.current.setAttribute('opacity', '1');
        } else {
          // Center title vertically when no count
          tooltipTitleRef.current.setAttribute('x', tooltipX.toString());
          tooltipTitleRef.current.setAttribute('y', (tooltipY + tooltipHeight / 2 + 6).toString());
          tooltipCountRef.current.setAttribute('opacity', '0');
        }

        // Ensure tooltip is visible - opacity transition is handled by CSS
        if (tooltipGroupRef.current.getAttribute('opacity') !== '1') {
          tooltipGroupRef.current.style.opacity = '1';
          tooltipGroupRef.current.setAttribute('opacity', '1');
        }
      }

      // Continue updating while hovering
      if (isActive) {
        animationFrameId = requestAnimationFrame(updateTooltipPosition);
      }
    };

    // Initialize smoothed position to node position immediately
    const node = nodesRef.current.find(n => n.id === hoveredNodeId);
    if (node) {
      lastX = node.x;
      lastY = node.y;
    }

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
      className="relative w-full h-full overflow-visible bg-transparent"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: `${dimensions.height}px`,
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
