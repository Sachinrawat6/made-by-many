import { useState, useEffect, useCallback } from "react";
import { fetchOrderById } from "@/api/nocodb";
import { fetchProductByStyleCode } from "@/api/product";
import { STATIC_MEMBERS, TEAM_ROLES } from "@/constants/team";

export function useOrderData(orderId) {
  const [status,      setStatus]      = useState(orderId ? "loading" : "idle");
  const [team,        setTeam]        = useState([]);
  const [productInfo, setProductInfo] = useState(null);
  const [error,       setError]       = useState(null);

  const resolveTeam = useCallback((locationMap) => {
    const staticPart = STATIC_MEMBERS.map((m) => ({ ...m }));

    const dynamicPart = TEAM_ROLES.map((roleConfig) => {
      let resolvedName = roleConfig.defaultName;

      for (const locKey of roleConfig.locationKeys) {
        const key = locKey.toLowerCase();
        const found =
          locationMap[key] ||
          Object.entries(locationMap).find(([k]) => k.includes(key) || key.includes(k))?.[1];
        if (found) { resolvedName = found; break; }
      }

      const description =
        typeof roleConfig.description === "function"
          ? roleConfig.description(resolvedName)
          : roleConfig.description;

      return { ...roleConfig, name: resolvedName, description };
    });

    return [...staticPart, ...dynamicPart];
  }, []);

  const fetchData = useCallback(async () => {
    if (!orderId) { setStatus("idle"); return; }

    setStatus("loading");
    setError(null);

    try {
      const { locationMap, orderMeta: meta, rawRecords } = await fetchOrderById(orderId);

      if (rawRecords.length === 0) {
        setTeam(resolveTeam({}));
        setProductInfo(null);
        setStatus("success");
        return;
      }

      // Render team immediately
      setTeam(resolveTeam(locationMap));
      setStatus("success");

      // Fetch product title in background (non-blocking)
      (async () => {
        try {
          const styleNumber = meta?.style_number;
          if (!styleNumber) return;
          const product = await fetchProductByStyleCode(styleNumber);
          if (product) setProductInfo(product);
        } catch {
          // Silently fail — team already visible
        }
      })();

    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong.");
      setStatus("error");
    }
  }, [orderId, resolveTeam]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { status, team, productInfo, error, refetch: fetchData };
}
