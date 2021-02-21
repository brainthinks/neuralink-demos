import React, { useEffect, useState } from 'react';
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

  const [ startTime, setStartTime ] = useState(null);
  const [ monitorDuration, setMonitorDuration ] = useState('00:00:00');
  const [ heapSizeLimit, setHeapSizeLimit ] = useState(getMemoryInfo('jsHeapSizeLimit'));
  const [ totalHeapSize, setTotalHeapSize ] = useState(getMemoryInfo('totalJSHeapSize'));
  const [ usedHeapSize, setUsedHeapSize ] = useState(getMemoryInfo('usedJSHeapSize'));

  useEffect(() => {
    if (!isMonitoring) {
      return;
    }

    setStartTime(Date.now());
  }, [isMonitoring]);

  useEffect(() => {
    if (!startTime) {
      console.log('Waiting until monitoring begins to update status');
      return;
    }

    console.log('monitoring...')

    setTimeout(() => {
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
      setHeapSizeLimit(getMemoryInfo('jsHeapSizeLimit'));
      setTotalHeapSize(getMemoryInfo('totalJSHeapSize'));
      setUsedHeapSize(getMemoryInfo('usedJSHeapSize'));
    }, 1000);
  }, [startTime, monitorDuration]);

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
