import React from 'react';

interface PageProps {
    list: any[];
    listProcessor: (arg: any) => {
        processed: { [key: string]: any };
        elements: JSX.Element[]
    };
    onProcessEnd: (arg: any) => void;
}
const Page = ( props: PageProps ) => {
    const { list, listProcessor, onProcessEnd
    } = props;

    const { processed, elements } = listProcessor(list);

    onProcessEnd(processed);

    return <>
        {elements}
    </>
}

export default Page;