import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Paper, Stack } from '@mui/material';
import invariant from 'tiny-invariant';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import DropIndicator from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';

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

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [draggableState, setDraggableState] =
    useState<DraggableState>(idleState);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  useEffect(() => {
    const containerElement = containerRef.current;
    const dragElement = credentialRequestItem?.dragRef.current;
    if (!dragElement || !containerElement) return;

    return combine(
      draggable({
        element: dragElement,
        getInitialData: () => credentialRequestField,
        onGenerateDragPreview({ nativeSetDragImage }) {
          console.log(123);
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
        onDrop() {
          setDraggableState(idleState);
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
          const isItemAfterSource =
            credentialRequestField.index === sourceIndex + 1;

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === 'bottom') ||
            (isItemAfterSource && closestEdge === 'top') ||
            source.data.level !== credentialRequestField.level;

          if (isDropIndicatorHidden) {
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
  }, [credentialRequestField, credentialRequestItem]);

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return source.data.level === credentialRequestField.level;
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;
        if (
          typeof sourceData.level === 'undefined' ||
          typeof targetData.level === 'undefined'
        ) {
          return;
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        console.log(sourceData, targetData, closestEdgeOfTarget);
      },
    });
  }, [credentialRequestField]);

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
    <>
      <Stack ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
        {renderView()}
        {closestEdge ? <DropIndicator edge={closestEdge} gap='1px' /> : null}
      </Stack>
      {draggableState.type === 'preview' &&
        ReactDOM.createPortal(
          <Stack sx={{ maxWidth: '344px' }}>{renderView()}</Stack>,
          draggableState.container
        )}
    </>
  );
}
