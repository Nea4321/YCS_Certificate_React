import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import { setOrganization } from "@/shared/slice/OrganizationSlice";
import { certificateApi } from "@/entities/certificate/api/certificate-api";

export function useOrganizations() {
    const dispatch = useDispatch();
    const hasData = useSelector((s: RootState) => s.organization.list.length > 0);

    useEffect(() => {
        if (hasData) return;
        const controller = new AbortController();

        (async () => {
            try {
                const data = await certificateApi.getOrganization(controller.signal);
                dispatch(setOrganization(data));
            } catch (e) {
                const isAbort =
                    e instanceof DOMException && e.name === "Error";
                const isAxiosAbort =
                    typeof e === "object" && e && "code" in e && (e as { code?: unknown }).code === "CANCELED";
                if (!isAbort && !isAxiosAbort) {
                    console.error("[ORG] load failed", e);
                }
            }
        })();

        return () => controller.abort();
    }, [hasData, dispatch]);
}
