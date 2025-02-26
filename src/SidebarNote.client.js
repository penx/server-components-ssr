/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useState, useRef, useEffect, useTransition} from 'react';

import {useLocation} from './LocationContext.client';

export default function SidebarNote({id, title, children, expandedChildren}) {
  const [location, setLocation] = useLocation();
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = id === location.selectedId;

  // Animate after title is edited.
  const itemRef = useRef(null);
  const prevTitleRef = useRef(title);
  useEffect(() => {
    if (title !== prevTitleRef.current) {
      prevTitleRef.current = title;
      itemRef.current.classList.add('flash');
    }
  }, [title]);

  return (
    <div
      ref={itemRef}
      onAnimationEnd={() => {
        itemRef.current.classList.remove('flash');
      }}
      className={[
        'sidebar-note-list-item',
        isExpanded ? 'note-expanded' : '',
      ].join(' ')}>
      {children}
      <a
        className="sidebar-note-open"
        style={{
          backgroundColor: isPending
            ? 'var(--gray-80)'
            : isActive
            ? 'var(--tertiary-blue)'
            : undefined,
          border: isActive
            ? '1px solid var(--primary-border)'
            : '1px solid transparent',
        }}
        href={`?${new URLSearchParams({
          selectedId: id,
          ...(location.searchText
            ? {
                searchText: location.searchText,
              }
            : {}),
        })}`}
        onClick={(e) => {
          startTransition(() => {
            setLocation((loc) => ({
              selectedId: id,
              isEditing: false,
              searchText: loc.searchText,
            }));
          });
          e.preventDefault();
        }}>
        Open note for preview
      </a>
      <button
        className="sidebar-note-toggle-expand"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}>
        {isExpanded ? (
          <img
            src="chevron-down.svg"
            width="10px"
            height="10px"
            alt="Collapse"
          />
        ) : (
          <img src="chevron-up.svg" width="10px" height="10px" alt="Expand" />
        )}
      </button>
      {isExpanded && expandedChildren}
    </div>
  );
}
