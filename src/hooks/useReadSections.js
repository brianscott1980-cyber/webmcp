import { useState, useEffect } from 'react';

const useReadSections = (sections) => {
  const [readSections, setReadSections] = useState({});

  useEffect(() => {
    // Create an intersection observer to track when sections are visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          
          console.log(`Section ${sectionId} intersection:`, {
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            wasAlreadyRead: readSections[sectionId]
          });
          
          // Mark section as read when it becomes visible
          if (entry.isIntersecting && !readSections[sectionId]) {
            setReadSections(prev => ({
              ...prev,
              [sectionId]: true
            }));
          }
        });
      },
      {
        threshold: 0.8, // 80% of the section must be visible
        rootMargin: '-20px' // Slight buffer to ensure good visibility
      }
    );

    // Observe all sections
    if (sections) {
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          console.log(`Observing section ${section.id}`);   
          observer.observe(element);
        }else{
            console.warn(`Element with ID ${section.id} not found for observation.`);
        }

        // Also observe child sections if they exist
        if (section.children) {
          section.children.forEach(child => {
            const childElement = document.getElementById(child.id);
            if (childElement) {
              observer.observe(childElement);
            }
          });
        }
      });
    }

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [sections]); // Re-run if sections change

  return readSections;
};

export default useReadSections;