interface Props {
  readonly name: string;
  readonly isMonitoring: boolean;
  readonly isMuted: boolean;
  readonly setIsMonitoring: (isMonitoring: boolean) => void;
  readonly setIsMuted: (isMuted: boolean) => void;
}

function ControlBar (props: Props) {
  const {
    name,
    isMonitoring,
    isMuted,
    setIsMonitoring,
    setIsMuted,
  } = props;

  return (
    <>
      <button onClick={() => setIsMonitoring(!isMonitoring)}>
        {
          isMonitoring
            ? `Click here to stop monitoring.`
            : `Hi, ${name}! Click here to start monitoring your neural lace.`
        }
      </button>
      {
        isMonitoring &&
        <button onClick={() => setIsMuted(!isMuted)}>
          {
            isMuted
              ? `Click here to hear the spikes.`
              : `Mute`
          }
        </button>
      }
    </>
  );
}

export default ControlBar;
