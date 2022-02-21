import React, {useEffect, useRef} from 'react';

import uPlot from 'uplot';

import {optionsUpdateState, dataMatch} from 'uplot-wrappers-common';

export default function UplotReact({
    options,
    data,
    target,
    onDelete = () => { },
    onCreate = () => { },
    onZoom = () => { }
}: {
    options: uPlot.Options,
    data: uPlot.AlignedData,
    // eslint-disable-next-line
    target?: HTMLElement | ((self: uPlot, init: Function) => void),
    onDelete?: (chart: uPlot) => void
    onCreate?: (chart: uPlot) => void
    onZoom?: (chart: uPlot, min:number, max:number) => void
}): JSX.Element | null {
    const chartRef = useRef<uPlot | null>(null);
    const targetRef = useRef<HTMLDivElement>(null);

    function destroy(chart: uPlot | null) {
        if (chart) {
            onDelete(chart);
            chart.destroy();
            chartRef.current = null;
        }
    }
    function create() {
        const newChart = new uPlot(options, data, target || targetRef.current as HTMLDivElement)
        chartRef.current = newChart;
        onCreate(newChart);
    }

    function zoom(chart: uPlot | null) {
        if (chart) {
            const  u = chart
            const min = u.posToVal(u.select.left, 'x');
            const max = u.posToVal(u.select.left + u.select.width, 'x');

            console.log("Fetching data for range...", {min, max});

            // // set new data
            // u.setData([
            //     [ 3, 4, 5, 6],
            //     [30,23,35,27],
            // ], false);

            // // zoom to selection
            // u.setScale('x', {min, max});

            // // reset selection
            // // u.setSelect({width: 0, height: 0}, false);

            // chart.setSelect({left:0,top:0,width:chart.width,height:chart.height}, true)
            onZoom(chart,min, max)
        }
        
    }
    // componentDidMount + componentWillUnmount
    useEffect(() => {
        create();
        return () => {
            destroy(chartRef.current);
        }
    }, []);
    // componentDidUpdate
    const prevProps = useRef({options, data, target}).current;
    useEffect(() => {
        const chart = chartRef.current;
        if (prevProps.options !== options) {
            const optionsState = optionsUpdateState(prevProps.options, options);
            if (!chart || optionsState === 'create') {
                destroy(chart);
                zoom(chart) ;
                create();
            } else if (optionsState === 'update') {
                chart.setSize({width: options.width, height: options.height});
            }
        }
        if (prevProps.data !== data) {
            if (!chart) {
                create();
            } else if (!dataMatch(prevProps.data, data)) {
                chart.setData(data);
            }
        }
        if (prevProps.target !== target) {
            destroy(chart);
            zoom(chart);
            create();
        }

        return () => {
            prevProps.options = options;
            prevProps.data = data;
            prevProps.target = target;
        };
    }, [options, data, target]);

    return target ? null : <div ref={targetRef}></div>;
}
