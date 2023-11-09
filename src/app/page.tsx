'use client'
import MainDnd from "@/components/MainDnd";
import React, { useEffect, useState } from 'react';

export default function Home() {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(process.browser);
    }, []);

    return <>{isBrowser ? <MainDnd /> : null}</>;
}




