/* eslint-disable no-useless-catch */

import { useState, useEffect, useCallback } from "react";

const useSubscriptions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3042/subscriptions");

      if (!response.ok) {
        throw new Error(`Kunne ikke hente abonnenter: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const createSubscription = async (email) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3042/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Kunne ikke oprette abonnement: ${response.status}`);
      }

      const result = await response.json();
      await fetchSubscriptions();
      return result;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchSubscriptions,
    createSubscription,
  };
};

export default useSubscriptions;
