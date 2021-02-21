import { useEffect, useState } from 'react';
import humanize from 'humanize';
import moment from 'moment';

function getMemoryInfo (property) {
  if (window.performance.memory) {
    return humanize.filesize(window.performance.memory[property]);
  }

  return 'N/A';
}

function formatTimeSegment (value) {
  return value < 10
    ? `0${value}`
    : value;
}

function StatusBar (props) {
  const {
    isMonitoring,
  } = props;

  const [ monitorInterval, setMonitorInterval ] = useState(null);
  const [ startTime, setStartTime ] = useState(null);
  const [ lastStoppedTime, setLastStoppedTime ] = useState(null);
  const [ monitorDuration, setMonitorDuration ] = useState('00:00:00');
  const [ heapSizeLimit, setHeapSizeLimit ] = useState(getMemoryInfo('jsHeapSizeLimit'));
  const [ totalHeapSize, setTotalHeapSize ] = useState(getMemoryInfo('totalJSHeapSize'));
  const [ usedHeapSize, setUsedHeapSize ] = useState(getMemoryInfo('usedJSHeapSize'));

  useEffect(() => {
    if (!startTime) {
      if (isMonitoring) {
        setStartTime(Date.now());
        return;
      }

      console.log('Waiting until monitoring begins to update status');
      return;
    }

    if (!isMonitoring) {
      if (monitorInterval !== null) {
        clearInterval(monitorInterval);
        setMonitorInterval(null);

        setLastStoppedTime(Date.now());
      }

      console.log(isMonitoring, startTime, monitorDuration, monitorInterval)
      console.log('no longer monitoring');
      return;
    }

    if (lastStoppedTime !== null) {
      setStartTime(startTime + (Date.now() - lastStoppedTime));
      setLastStoppedTime(null);
      return;
    }

    setMonitorInterval(setInterval(() => {
      const now = Date.now();

      const hoursFromStart = Math.floor(moment.duration(now - startTime).asHours());
      const minutesFromStart = Math.floor(moment.duration(now - startTime).asMinutes()) - (hoursFromStart * 60);
      const secondsFromStart = Math.floor(moment.duration(now - startTime).asSeconds()) - (hoursFromStart * 60 * 60) -
        (minutesFromStart * 60);

      setMonitorDuration([
        formatTimeSegment(hoursFromStart),
        formatTimeSegment(minutesFromStart),
        formatTimeSegment(secondsFromStart),
      ].join(':'));

      // @todo - these could be split into a separate effect
      setHeapSizeLimit(getMemoryInfo('jsHeapSizeLimit'));
      setTotalHeapSize(getMemoryInfo('totalJSHeapSize'));
      setUsedHeapSize(getMemoryInfo('usedJSHeapSize'));
    }, 500));
  }, [isMonitoring, startTime]);

  return (
    <section className="statusBar">
      <span>Monitor Duration: {monitorDuration}</span>
      <span>Heap Size Limit: {heapSizeLimit}</span>
      <span>Total Heap Size: {totalHeapSize}</span>
      <span>Used Heap Size: {usedHeapSize}</span>
    </section>
  );
}

export default StatusBar;
