import { useState, useEffect, useCallback } from "react";
import { fetchOrderById } from "@/api/nocodb";
import { fetchProductByStyleCode, fetchMyntraImage } from "@/api/product";
import { STATIC_MEMBERS, TEAM_ROLES } from "@/constants/team";

export function useOrderData(orderId) {
  const [status,        setStatus]        = useState(orderId ? "loading" : "idle");
  const [team,          setTeam]          = useState([]);
  const [productInfo,   setProductInfo]   = useState(null);
  const [imageLoading,  setImageLoading]  = useState(false);
  const [error,         setError]         = useState(null);

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
      // Step 1: NocoDB + product API in parallel
      const [{ locationMap, orderMeta: meta, rawRecords }, _] = await Promise.all([
        fetchOrderById(orderId),
        Promise.resolve(), // placeholder for future parallel calls
      ]);

      // No scans found → default team, no product
      if (rawRecords.length === 0) {
        setTeam(resolveTeam({}));
        setProductInfo(null);
        setStatus("success");
        return;
      }

      // Step 2: resolve team immediately (fast — no extra API call)
      setTeam(resolveTeam(locationMap));
      setStatus("success"); // ← page renders NOW, product loads after

      // Step 3: fetch product info in background (non-blocking)
      const product = await fetchProductByStyleCode(meta?.style_number);
      if (!product) { setProductInfo(null); return; }

      // Show product name immediately, image comes next
      setProductInfo({ ...product, imageUrl: null });
      setImageLoading(true);

      // Fetch Myntra image — page already visible, image just pops in
      const imageUrl = await fetchMyntraImage(product.style_id);
      setImageLoading(false);
      setProductInfo({ ...product, imageUrl });

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(message);
      setStatus("error");
    }
  }, [orderId, resolveTeam]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { status, team, productInfo, imageLoading, error, refetch: fetchData };
}
