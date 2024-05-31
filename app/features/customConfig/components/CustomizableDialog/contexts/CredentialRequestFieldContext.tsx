import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { Stack } from '@mui/material';
import { FieldArrayWithId, UseFieldArrayReturn } from 'react-hook-form';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';

import { CustomDemoForm } from '~/features/customConfig/validators/form';

type CredentialRequestFieldContext = PropsWithChildren & {
  path: string | undefined;
  field: FieldArrayWithId<CustomDemoForm, 'credentialRequests'>;
  fieldArray: UseFieldArrayReturn<CustomDemoForm, 'credentialRequests'>;
  index: number;
  level: number;
  dragRef: React.MutableRefObject<HTMLButtonElement | null>;
};

type DraggableState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'dragging' };

const idleState: DraggableState = { type: 'idle' };
const draggingState: DraggableState = { type: 'dragging' };

const Context = createContext<CredentialRequestFieldContext | null>(null);

export const useCredentialRequestField = () => {
  return useContext(Context);
};

export function CredentialRequestFieldProvider({
  children,
  ...props
}: Omit<CredentialRequestFieldContext, 'dragRef'>) {
  const dragRef = useRef<HTMLButtonElement | null>(null);

  const [draggableState, setDraggableState] =
    useState<DraggableState>(idleState);

  const containerStyle = {
    p: '0!important',
    width: `calc(100% - ${props.level * 30}px)!important`,
    alignSelf: 'flex-end',
  };

  useEffect(() => {
    if (!dragRef.current) return;

    return draggable({
      element: dragRef.current,
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
      onDrop() {
        setDraggableState(idleState);
      },
    });
  }, []);

  return (
    <Context.Provider value={{ ...props, dragRef }}>
      <Stack
        spacing={1}
        sx={{
          opacity: draggableState.type === 'dragging' ? 0.4 : 1,
          ...containerStyle,
        }}
      >
        {children}
      </Stack>
      {draggableState.type === 'preview' &&
        ReactDOM.createPortal(
          React.cloneElement(
            <Stack spacing={1} sx={{ maxWidth: '344px', ...containerStyle }}>
              {children}
            </Stack>
          ),
          draggableState.container
        )}
    </Context.Provider>
  );
}
