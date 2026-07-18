import { MapPosition } from "@app-types/Map.type.ts";
import { MessageState } from "@app-types/Message.type.ts";
import { useMessageBroker } from "@providers/MessageBrokerProvider.ts";

export const MapOptions = () => {
  const { notify } = useMessageBroker();

  const onSubmit = () => {
    notify({
      state: MessageState.MapSetupReady,
    });
  };

  const onReset = () => {
    notify({
      state: MessageState.MoveMap,
      data: MapPosition.CENTER,
    });
    notify({
      state: MessageState.ResizeMap,
      data: "map__canvas--medium",
    });
  };

  const setPosition = (mapPosition: MapPosition) => {
    notify({
      state: MessageState.MoveMap,
      data: mapPosition,
    });
  };

  const setSize = (size: string) => {
    notify({
      state: MessageState.ResizeMap,
      data: size,
    });
  };

  return (
    <div className="map__options">
      <fieldset>
        <legend>Map position</legend>
        <button type="button" onClick={() => setPosition(MapPosition.TOP_LEFT)}>
          &#11017;
        </button>
        <button
          type="button"
          onClick={() => setPosition(MapPosition.TOP_RIGHT)}
        >
          &#11016;
        </button>
        <button type="button" onClick={() => setPosition(MapPosition.CENTER)}>
          &#9737;
        </button>
        <button
          type="button"
          onClick={() => setPosition(MapPosition.BOTTOM_LEFT)}
        >
          &#11019;
        </button>
        <button
          type="button"
          onClick={() => setPosition(MapPosition.BOTTOM_RIGHT)}
        >
          &#11018;
        </button>
      </fieldset>
      <fieldset>
        <legend>Map size</legend>
        <button type="button" onClick={() => setSize("map__canvas--small")}>
          S
        </button>
        <button type="button" onClick={() => setSize("map__canvas--medium")}>
          M
        </button>
        <button type="button" onClick={() => setSize("map__canvas--large")}>
          L
        </button>
      </fieldset>
      <fieldset>
        <legend>Actions</legend>
        <button onClick={onReset} type="button">
          Reset
        </button>
        <button onClick={onSubmit} className="action" type="button">
          Add map
        </button>
      </fieldset>
    </div>
  );
};
