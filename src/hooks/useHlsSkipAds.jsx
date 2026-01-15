import { useEffect, useRef } from "react";
import Hls from "hls.js";

function useHlsSkipAds(tapPhim, videoRef, enableSkipAds = false, autoPlay = false) {
    const adRangesRef = useRef([]);
    const isSeekingRef = useRef(false);

    useEffect(() => {
        if (!enableSkipAds) return;
        if (!tapPhim || !videoRef.current) return;
        if (!Hls.isSupported()) return;

        const START_OFFSET = 0.1;
        const END_OFFSET = 0.1;

        const video = videoRef.current;
        const hls = new Hls({ debug: false });

        adRangesRef.current = [];

        hls.loadSource(tapPhim);
        hls.attachMedia(video);

        // ===== PARSE ADS =====
        hls.on(Hls.Events.LEVEL_LOADED, (_, data) => {
            if (adRangesRef.current.length > 0) return;

            const fragments = data.details.fragments;
            let firstDIS = null;
            let firstIndex = null;

            fragments.forEach((frag, index) => {
                const isDIS2 =
                    frag.tagList &&
                    frag.tagList.some(tag => tag[0] === "DIS") &&
                    frag.tagList.length === 2;

                if (!isDIS2) return;

                if (firstDIS === null) {
                    firstDIS = frag.start;
                    firstIndex = index;
                } else {
                    const start = firstDIS;
                    const end = frag.start;

                    const middle = fragments.slice(firstIndex + 1, index);
                    const hasTag3 = middle.some(
                        f => f.tagList && f.tagList.length === 3
                    );

                    if (!hasTag3 && end > start && end - start < 120) {
                        adRangesRef.current.push({ start, end });
                    }

                    firstDIS = null;
                    firstIndex = null;
                }
            });

            // DIS lẻ → skip tới cuối
            if (firstDIS !== null) {
                const waitDuration = () => {
                    if (isFinite(video.duration) && video.duration > 0) {
                        adRangesRef.current.push({
                            start: firstDIS,
                            end: video.duration
                        });
                    } else {
                        setTimeout(waitDuration, 200);
                    }
                };
                waitDuration();
            }
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (autoPlay) {
                video.play().catch(() => { });
            }
        });

        // ===== SKIP =====
        const onTimeUpdate = () => {
            if (isSeekingRef.current) return;

            const t = video.currentTime;

            for (const ad of adRangesRef.current) {
                if (t >= ad.start - START_OFFSET && t < ad.end) {
                    isSeekingRef.current = true;

                    requestAnimationFrame(() => {
                        const target = ad.end + END_OFFSET;
                        video.fastSeek
                            ? video.fastSeek(target)
                            : (video.currentTime = target);

                        setTimeout(() => {
                            isSeekingRef.current = false;
                        }, 400);
                    });

                    break;
                }
            }
        };

        video.addEventListener("timeupdate", onTimeUpdate);

        return () => {
            video.removeEventListener("timeupdate", onTimeUpdate);
            hls.destroy();
        };
    }, [tapPhim, enableSkipAds,autoPlay ]);
}

export default useHlsSkipAds;
