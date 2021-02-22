import { useEffect, useState } from 'react';
import humanize from 'humanize';
import moment from 'moment';

enum PerformanceMemoryProperties {
  jsHeapSizeLimit = 'jsHeapSizeLimit',
  totalJSHeapSize = 'totalJSHeapSize',
  usedJSHeapSize = 'usedJSHeapSize',
}

interface Props {
  isMonitoring: boolean;
}

// @see - https://stackoverflow.com/a/43513740
// @see - https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation
declare global {
  interface Window {
    performance: {
      memory: any;
    }
  }
}

function getMemoryInfo (property: PerformanceMemoryProperties): string {
  if (window.performance.memory) {
    return humanize.filesize(window.performance.memory[property]);
  }

  return 'N/A';
}

function formatTimeSegment (value: number): string {
  return value < 10
    ? `0${value}`
    : value.toString();
}

function StatusBar (props: Props) {
  const {
    isMonitoring,
  } = props;

  const [ monitorInterval, setMonitorInterval ] = useState<NodeJS.Timeout|null>(null);
  const [ startTime, setStartTime ] = useState<number|null>(null);
  const [ lastStoppedTime, setLastStoppedTime ] = useState<number|null>(null);
  const [ monitorDuration, setMonitorDuration ] = useState('00:00:00');
  const [ heapSizeLimit, setHeapSizeLimit ] = useState(getMemoryInfo(PerformanceMemoryProperties.jsHeapSizeLimit));
  const [ totalHeapSize, setTotalHeapSize ] = useState(getMemoryInfo(PerformanceMemoryProperties.totalJSHeapSize));
  const [ usedHeapSize, setUsedHeapSize ] = useState(getMemoryInfo(PerformanceMemoryProperties.usedJSHeapSize));

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
      setHeapSizeLimit(getMemoryInfo(PerformanceMemoryProperties.jsHeapSizeLimit));
      setTotalHeapSize(getMemoryInfo(PerformanceMemoryProperties.totalJSHeapSize));
      setUsedHeapSize(getMemoryInfo(PerformanceMemoryProperties.usedJSHeapSize));
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
