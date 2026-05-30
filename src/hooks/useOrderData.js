import { useState, useEffect, useCallback } from "react";
import { fetchOrderById } from "@/api/nocodb";
import { STATIC_MEMBERS, TEAM_ROLES } from "@/constants/team";

/**
 * useOrderData
 *
 * Fetches all scan records for an order and resolves each team member's name
 * by matching location names from the API to role definitions.
 *
 * API record shape per scan:
 *   { employees: { user_name }, locations: { name }, orders_2: { order_id, style_number } }
 *
 * @param {string|null} orderId
 * @returns {{ status, team, orderMeta, error, refetch }}
 */
export function useOrderData(orderId) {
  const [status,    setStatus]    = useState(orderId ? "loading" : "idle");
  const [team,      setTeam]      = useState([]);
  const [orderMeta, setOrderMeta] = useState(null);
  const [error,     setError]     = useState(null);

  const resolveTeam = useCallback((locationMap) => {
    // Static members always first
    const staticPart = STATIC_MEMBERS.map((m) => ({ ...m }));

    // Dynamic members — match locationKeys against cleaned location names
    // Uses includes() so "cutting master" matches "cutting master" exactly
    const dynamicPart = TEAM_ROLES.map((roleConfig) => {
      let resolvedName = roleConfig.defaultName;

      for (const locKey of roleConfig.locationKeys) {
        const key = locKey.toLowerCase();
        // Exact match first, then partial match
        const found =
          locationMap[key] ||
          Object.entries(locationMap).find(([k]) => k.includes(key) || key.includes(k))?.[1];
        if (found) {
          resolvedName = found;
          break;
        }
      }

      // description is a function — call it with the resolved name
      const description =
        typeof roleConfig.description === "function"
          ? roleConfig.description(resolvedName)
          : roleConfig.description;

      return { ...roleConfig, name: resolvedName, description };
    });

    return [...staticPart, ...dynamicPart];
  }, []);

  const fetchData = useCallback(async () => {
    if (!orderId) {
      setStatus("idle");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const { locationMap, orderMeta: meta, rawRecords } = await fetchOrderById(orderId);

      // No records found — show default team, hide product info
      if (rawRecords.length === 0) {
        setOrderMeta(null);
        setTeam(resolveTeam({}));
        setStatus("success");
        return;
      }

      setOrderMeta(meta);
      setTeam(resolveTeam(locationMap));
      setStatus("success");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(message);
      setStatus("error");
    }
  }, [orderId, resolveTeam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { status, team, orderMeta, error, refetch: fetchData };
}
