interface Props {
  readonly name: string;
  readonly isMonitoring: boolean;
  readonly setIsMonitoring: (isMonitoring: boolean) => void;
}

function ControlBar (props: Props) {
  const {
    name,
    isMonitoring,
    setIsMonitoring,
  } = props;

  return (
    <button onClick={() => setIsMonitoring(!isMonitoring)}>
      {
        isMonitoring
          ? `Click here to stop monitoring.`
          : `Hi, ${name}! Click here to start monitoring your neural lace.`
      }
    </button>
  );
}

export default ControlBar;
