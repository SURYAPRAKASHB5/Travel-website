/**
 * Apex Voyages - Enhanced Scroll Reveal Engine
 * Monitors viewport milestones using high-performance IntersectionObservers.
 * Orchestrates linear entry systems, multi-directional tracking, and 
 * row-by-row layout staggered thresholds.
 */

(function() {
    'use strict';

    // Global reference holder for potential dynamic re-initialization routines
    let scrollObserver = null;

    document.addEventListener('DOMContentLoaded', () => {
        initScrollEngine();
    });

    /**
     * Main Core Initialization Routine
     */
    function initScrollEngine() {
        // Targets the default .scroll-reveal hooks from index.html as well as flexible direction modifiers
        const targetElements = document.querySelectorAll('.scroll-reveal, .reveal, .reveal-left, .reveal-right, .reveal-scale');
        
        if (!targetElements.length) return;

        // Clean up previous observer instance if re-initializing
        if (scrollObserver) {
            scrollObserver.disconnect();
        }

        /**
         * Context-Aware Grid Clustering & Row Stagger Allocator
         */
        const applyClusterStagger = (entries) => {
            const intersectingElements = entries
                .filter(entry => entry.isIntersecting)
                .map(entry => entry.target);

            if (!intersectingElements.length) return;

            // Group intersecting elements into rows by evaluating vertical screen space offsets
            const executionRows = {};
            intersectingElements.forEach(element => {
                const currentTop = Math.round(element.getBoundingClientRect().top);
                // 15px bounding variance tolerance for micro-layout shifts
                const matchedRowKey = Object.keys(executionRows).find(key => Math.abs(key - currentTop) < 15);

                if (matchedRowKey) {
                    executionRows[matchedRowKey].push(element);
                } else {
                    executionRows[currentTop] = [element];
                }
            });

            // Iterate across established rows and sequence inline transition delays dynamically
            Object.values(executionRows).forEach(rowGroup => {
                // Sort horizontally (left to right) to secure clean spatial reading direction transitions
                rowGroup.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);

                rowGroup.forEach((element, index) => {
                    element.style.transitionDelay = `${index * 0.15}s`;
                    element.classList.add('is-visible');
                });
            });
        };

        /**
         * IntersectionObserver Option Specifications
         */
        const observerOptions = {
            root: null, // Scans native viewport window
            rootMargin: '0px 0px -60px 0px', // Activates slightly prior to hitting clean fold lines
            threshold: 0.12 // Requires 12% layout intersection to trigger animation sequences
        };

        // Instantiating the unified asynchronous monitoring boundary engine
        scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const parent = target.parentElement;

                    // Evaluate if parent establishes multi-column card grid tracking clusters
                    const isGridStructure = parent && (
                        parent.classList.contains('card-grid') || 
                        parent.classList.contains('destinations-grid') || 
                        parent.classList.contains('features-grid')
                    );

                    if (isGridStructure && window.innerWidth >= 768) {
                        // Pass off to collective row calculation batches
                        applyClusterStagger(entries);
                    } else {
                        // Executing explicit zero-delay standard tracking fades
                        target.classList.add('is-visible');
                    }

                    // Sever layout hook tracking post-execution to preserve processing pools
                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        // Commit target references to browser tracking framework threads
        targetElements.forEach(element => {
            scrollObserver.observe(element);
        });
    }

    /**
     * Performance Optimization Cleaner Engine (Viewport Normalization)
     */
    let resizeDebounceTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeDebounceTimer);
        resizeDebounceTimer = setTimeout(() => {
            // Drop structured dynamic inline delays if user scales screens to small linear columns
            if (window.innerWidth < 768) {
                const visibleElements = document.querySelectorAll('.is-visible');
                visibleElements.forEach(el => {
                    el.style.transitionDelay = '';
                });
            }
        }, 150);
    }, { passive: true });

    /**
     * Global API Hook Architecture
     * Exposes programmatic lifecycle controls to companion modules if elements inject asynchronously
     */
    window.ApexScrollReveal = {
        refresh: () => {
            initScrollEngine();
        }
    };
})();