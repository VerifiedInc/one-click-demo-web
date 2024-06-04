import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Paper, Stack } from '@mui/material';
import invariant from 'tiny-invariant';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

import { DragIndicator } from '~/components/DragIndicator';

import { DataFieldAccordion } from '~/features/customConfig/components/CustomizableDialog/components/DataFieldAccordion';
import { useCredentialRequestField } from '~/features/customConfig/components/CustomizableDialog/contexts/CredentialRequestFieldContext';
import { useCredentialRequestItem } from '~/features/customConfig/components/CustomizableDialog/contexts/CredentialRequestItemContext';

type DraggableState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'dragging' };

const idleState: DraggableState = { type: 'idle' };
const draggingState: DraggableState = { type: 'dragging' };

export function CredentialRequestItem() {
  const credentialRequestField = useCredentialRequestField();
  const credentialRequestItem = useCredentialRequestItem();
  invariant(
    credentialRequestField,
    'CredentialRequestsFieldContext is required'
  );
  invariant(credentialRequestItem, 'CredentialRequestItemContext is required');

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [draggableState, setDraggableState] =
    useState<DraggableState>(idleState);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const containerElement = container;
    const dragElement = credentialRequestItem?.dragRef.current;
    if (!dragElement || !containerElement) return;

    const getParentPath = (path: string) =>
      path.split('.').slice(0, -2).join('.');

    return combine(
      draggable({
        element: dragElement,
        getInitialData: () => credentialRequestField,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: '16px',
              y: '8px',
            }),
            render({ container }) {
              setDraggableState({ type: 'preview', container });

              return () => setDraggableState(draggingState);
            },
          });
        },
        onDragStart() {
          setDraggableState(draggingState);
        },
        onDrop({ source, location }) {
          setDraggableState(idleState);

          const target = location.current.dropTargets[0];

          // It happens that there are no target the drop
          if (!target) return;

          const sourcePath = getParentPath(
            (source?.data?.path as string) || ''
          );
          const targetPath = getParentPath(
            (target?.data?.path as string) || ''
          );
          const isSameGroup = sourcePath === targetPath;

          const fromLevel = source.data.level as number;
          const fromIndex = source.data.index as number;
          const toLevel = target.data.level as number;
          const toIndex = target.data.index as number;

          // Allow to drop only on the same level and different index
          if (fromLevel !== toLevel || fromIndex === toIndex || !isSameGroup) {
            return;
          }

          credentialRequestField.fieldArray.move(fromIndex, toIndex);
        },
      }),
      dropTargetForElements({
        element: containerElement,
        canDrop({ source }) {
          return source.data.level === credentialRequestField.level;
        },
        getData({ input }) {
          return attachClosestEdge(credentialRequestField, {
            element: containerElement,
            input,
            allowedEdges: ['top', 'bottom'],
          });
        },
        onDrag({ self, source }) {
          const isSource = source.element === containerElement;
          if (isSource) {
            setClosestEdge(null);
            return;
          }

          const closestEdge = extractClosestEdge(self.data);

          const sourceIndex = source.data.index;
          invariant(typeof sourceIndex === 'number');

          const isItemBeforeSource =
            credentialRequestField.index === sourceIndex - 1;

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === 'bottom') ||
            source.data.level !== credentialRequestField.level;

          const sourcePath = getParentPath(
            (source?.data?.path as string) || ''
          );
          const targetPath = getParentPath((self?.data?.path as string) || '');
          const isSameGroup = sourcePath === targetPath;

          if (isDropIndicatorHidden || !isSameGroup) {
            setClosestEdge(null);
            return;
          }

          setClosestEdge(closestEdge);
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },
      })
    );
  }, [container, credentialRequestField, credentialRequestItem]);

  const renderView = () => {
    return (
      <Paper
        sx={{
          p: '0!important',
          width: `calc(100% - ${
            credentialRequestField?.level * 30
          }px)!important`,
          alignSelf: 'flex-end',
        }}
      >
        <DataFieldAccordion />
      </Paper>
    );
  };

  return (
    <div ref={(element) => setContainer(element)}>
      <Stack sx={{ position: 'relative', width: '100%' }}>
        {renderView()}
        {closestEdge ? (
          <DragIndicator offset={credentialRequestField.level * 30} />
        ) : null}
      </Stack>
      {draggableState.type === 'preview' &&
        ReactDOM.createPortal(
          <Stack sx={{ maxWidth: '344px' }}>{renderView()}</Stack>,
          draggableState.container
        )}
    </div>
  );
}
