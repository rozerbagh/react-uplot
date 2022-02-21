import React from 'react';
import uPlot from 'uplot';

export default function ({options, data, target, onDelete, onCreate, onZoom}: {
    options: uPlot.Options;
    data: uPlot.AlignedData;
    target?: HTMLElement | ((self: uPlot, init: Function) => void);
    onDelete?: (chart: uPlot) => void;
    onCreate?: (chart: uPlot) => void;
    onZoom?: (chart: uPlot) => void;
}): JSX.Element | null;
