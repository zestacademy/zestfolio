/**
 * ZESTFOLIO RENDERER v1.0
 * 
 * A framework-agnostic JavaScript renderer for dynamically injecting
 * user portfolio data into static HTML templates.
 * 
 * @description Processes data-bind attributes and populates templates with user content
 * @author Zestfolio Team
 * @license MIT
 */

(function () {
    'use strict';

    // ============================================================================
    // CONFIGURATION & UTILITIES
    // ============================================================================

    /**
     * Safe data accessor with fallback
     * @param {Object} obj - The data object
     * @param {String} path - Dot-notation path (e.g., "socialLinks.github")
     * @returns {*} The value or null
     */
    function getNestedValue(obj, path) {
        if (!obj || !path) return null;

        const keys = path.split('.');
        let value = obj;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return null;
            }
        }

        return value;
    }

    /**
     * Check if a value is considered "empty"
     * @param {*} value - The value to check
     * @returns {Boolean}
     */
    function isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string' && value.trim() === '') return true;
        if (Array.isArray(value) && value.length === 0) return true;
        return false;
    }

    /**
     * Safely hide an element
     * @param {HTMLElement} element - Element to hide
     */
    function hideElement(element) {
        if (element) {
            element.style.display = 'none';
        }
    }

    /**
     * Safely show an element
     * @param {HTMLElement} element - Element to show
     */
    function showElement(element) {
        if (element) {
            element.style.display = '';
        }
    }

    // ============================================================================
    // CORE RENDERER CLASS
    // ============================================================================

    class ZestfolioRenderer {
        constructor(data) {
            this.data = data || {};
        }

        /**
         * Main render method - orchestrates all binding operations
         */
        render() {
            if (!this.data) {
                console.warn('[Zestfolio] No portfolio data found');
                return;
            }

            try {
                this.bindTextElements();
                this.bindImageElements();
                this.bindSocialLinks();
                this.renderLoops();
                this.handleConditionalSections();
            } catch (error) {
                console.error('[Zestfolio] Render error:', error);
            }
        }

        /**
         * Bind text content to elements with data-bind attribute
         */
        bindTextElements() {
            const elements = document.querySelectorAll('[data-bind]');

            elements.forEach(element => {
                const fieldName = element.getAttribute('data-bind');
                const value = getNestedValue(this.data, fieldName);

                if (!isEmpty(value)) {
                    element.textContent = value;
                    showElement(element);
                } else {
                    hideElement(element);
                }
            });
        }

        /**
         * Bind image sources to elements with data-bind-img attribute
         */
        bindImageElements() {
            const elements = document.querySelectorAll('[data-bind-img]');

            elements.forEach(element => {
                const fieldName = element.getAttribute('data-bind-img');
                const value = getNestedValue(this.data, fieldName);

                if (!isEmpty(value)) {
                    element.src = value;
                    element.alt = element.alt || `${fieldName} image`;
                    showElement(element);

                    // Handle image load errors gracefully
                    element.onerror = () => hideElement(element);
                } else {
                    hideElement(element);
                }
            });
        }

        /**
         * Bind and manage social media links
         */
        bindSocialLinks() {
            const socialLinks = this.data.socialLinks || {};

            const linkMap = {
                'social-github': socialLinks.github,
                'social-linkedin': socialLinks.linkedin,
                'social-twitter': socialLinks.twitter,
                'social-website': socialLinks.website,
                'social-email': this.data.publicEmail || this.data.email
            };

            Object.entries(linkMap).forEach(([id, url]) => {
                const element = document.getElementById(id);

                if (element) {
                    if (!isEmpty(url)) {
                        // Handle email links specially
                        if (id === 'social-email' && !url.startsWith('mailto:')) {
                            element.href = `mailto:${url}`;
                        } else if (!url.startsWith('http') && !url.startsWith('mailto:')) {
                            element.href = `https://${url}`;
                        } else {
                            element.href = url;
                        }
                        showElement(element);
                    } else {
                        hideElement(element);
                    }
                }
            });
        }

        /**
         * Render array-based loops using template tags
         */
        renderLoops() {
            // Handle block loops (education, projects, certifications)
            this.renderBlockLoop('education');
            this.renderBlockLoop('projects');
            this.renderBlockLoop('certifications');

            // Handle inline loops (skills)
            this.renderInlineLoop('skills');
        }

        /**
         * Render a block-level loop (e.g., education, projects)
         * @param {String} loopName - The name of the data array
         */
        renderBlockLoop(loopName) {
            const sections = document.querySelectorAll(`[data-loop="${loopName}"]`);

            sections.forEach(section => {
                const template = section.querySelector('template');
                const dataArray = this.data[loopName];

                if (!template) return;

                // If no data, hide the entire section
                if (isEmpty(dataArray)) {
                    hideElement(section);
                    return;
                }

                const container = document.createElement('div');
                container.className = template.className || '';

                dataArray.forEach((item, index) => {
                    const clone = template.content.cloneNode(true);

                    // Bind text fields within the clone
                    clone.querySelectorAll('[data-bind]').forEach(el => {
                        const fieldName = el.getAttribute('data-bind');
                        const value = item[fieldName];

                        if (!isEmpty(value)) {
                            el.textContent = value;
                        } else {
                            hideElement(el);
                        }
                    });

                    // Bind images within the clone
                    clone.querySelectorAll('[data-bind-img]').forEach(el => {
                        const fieldName = el.getAttribute('data-bind-img');
                        const value = item[fieldName];

                        if (!isEmpty(value)) {
                            el.src = value;
                            el.alt = item.title || item.name || `${fieldName} ${index}`;
                        } else {
                            hideElement(el);
                        }
                    });

                    // Handle special date range binding for education
                    clone.querySelectorAll('[data-bind-range]').forEach(el => {
                        const fields = el.getAttribute('data-bind-range').split(',');
                        const startDate = item[fields[0]];
                        const endDate = item[fields[1]];
                        const isCurrent = item[fields[2]];

                        if (startDate) {
                            const end = isCurrent ? 'Present' : (endDate || 'Present');
                            el.textContent = `${startDate} — ${end}`;
                        }
                    });

                    // Handle technologies/skills array within projects
                    clone.querySelectorAll('[data-bind-array]').forEach(el => {
                        const fieldName = el.getAttribute('data-bind-array');
                        const array = item[fieldName];

                        if (Array.isArray(array) && array.length > 0) {
                            el.innerHTML = array.map(tech =>
                                `<span class="inline-block px-2 py-1 text-xs">${tech}</span>`
                            ).join('');
                        } else {
                            hideElement(el);
                        }
                    });

                    // Handle links within projects
                    clone.querySelectorAll('[data-bind-link]').forEach(el => {
                        const fieldName = el.getAttribute('data-bind-link');
                        const url = item[fieldName];

                        if (!isEmpty(url)) {
                            el.href = url.startsWith('http') ? url : `https://${url}`;
                        } else {
                            hideElement(el);
                        }
                    });

                    container.appendChild(clone);
                });

                // Replace template with rendered content
                template.parentNode.insertBefore(container, template);
                template.remove();

                showElement(section);
            });
        }

        /**
         * Render an inline loop (e.g., skills as tags)
         * @param {String} loopName - The name of the data array
         */
        renderInlineLoop(loopName) {
            const sections = document.querySelectorAll(`[data-loop-inline="${loopName}"]`);

            sections.forEach(section => {
                const template = section.querySelector('template');
                const dataArray = this.data[loopName];

                if (!template) return;

                // If no data, hide the entire section
                if (isEmpty(dataArray)) {
                    hideElement(section);
                    return;
                }

                const container = document.createElement('div');
                container.className = 'flex flex-wrap gap-2';

                dataArray.forEach(item => {
                    const clone = template.content.cloneNode(true);
                    const span = clone.querySelector('span') || clone.firstElementChild;

                    if (span) {
                        span.textContent = item;
                    }

                    container.appendChild(clone);
                });

                // Replace template with rendered content
                template.parentNode.insertBefore(container, template);
                template.remove();

                showElement(section);
            });
        }

        /**
         * Handle conditional section visibility
         */
        handleConditionalSections() {
            const elements = document.querySelectorAll('[data-show-if]');

            elements.forEach(element => {
                const fieldName = element.getAttribute('data-show-if');
                const value = getNestedValue(this.data, fieldName);

                if (isEmpty(value)) {
                    hideElement(element);
                } else {
                    showElement(element);
                }
            });
        }
    }

    // ============================================================================
    // AUTO-INITIALIZATION
    // ============================================================================

    /**
     * Initialize renderer when DOM is ready
     */
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Check for portfolio data
        const portfolioData = window.PORTFOLIO_DATA;

        if (!portfolioData) {
            console.warn('[Zestfolio] No PORTFOLIO_DATA found on window object');
            return;
        }

        // Create and run renderer
        const renderer = new ZestfolioRenderer(portfolioData);
        renderer.render();

        // Expose renderer for debugging (optional)
        if (typeof window !== 'undefined') {
            window.__ZESTFOLIO_RENDERER__ = renderer;
        }
    }

    // Start initialization
    init();

})();
