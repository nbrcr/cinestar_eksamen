/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import { useState, useEffect, useCallback } from "react";

// Custom hook til at håndtere blogs
const useBlogs = () => {
  // State til at holde på blogdata, loading-status og fejl
  const [data, setData] = useState(null); // Initialiserer blogdata som null
  const [loading, setLoading] = useState(true); // Initialiserer loading som true
  const [error, setError] = useState(null); // Initialiserer error som null

  // Funktion til at hente blogs fra API'et
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true); // Sætter loading til true, mens vi henter data
      const response = await fetch("http://localhost:3042/blogs");

      // Hvis API'et ikke svarer korrekt, kastes en fejl
      if (!response.ok) {
        throw new Error(`Kunne ikke hente blogs: ${response.status}`);
      }

      const result = await response.json(); // Henter JSON-responsen
      setData(result); // Sætter data i state
      setError(null); // Resetter error til null
    } catch (err) {
      setError(err.message); // Sætter fejlmeddelelsen, hvis der opstår en fejl
      setData(null); // Resetter data til null, hvis der opstår fejl
    } finally {
      setLoading(false); // Når fetch er færdig, sættes loading til false
    }
  }, []); // useCallback bruges for at undgå unødvendige re-renders

  // useEffect kører fetchBlogs når komponenten først mountes eller fetchBlogs ændres
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Funktion til at oprette en ny blog
  const createBlog = async (formData) => {
    try {
      setLoading(true); // Sætter loading til true under oprettelsen
      const response = await fetch("http://localhost:3042/blog", {
        method: "POST",
        body: formData, // Sender data i formData-format
      });

      if (!response.ok) {
        throw new Error(`Kunne ikke oprette blog: ${response.status}`);
      }

      const result = await response.json(); // Henter resultatet fra serveren
      await fetchBlogs(); // Genindlæser blogdataene
      return result; // Returnerer den oprettede blog
    } catch (err) {
      throw err; // Kaster fejl videre
    } finally {
      setLoading(false); // Sætter loading til false når oprettelsen er færdig
    }
  };

  // Funktion til at opdatere en blog
  const updateBlog = async (id, formData) => {
    if (!id) {
      throw new Error("Blog ID er påkrævet for opdatering"); // Hvis ID ikke findes, kast fejl
    }

    try {
      setLoading(true); // Sætter loading til true under opdatering
      formData.append("id", id); // Tilføjer blog-ID til formData

      const response = await fetch("http://localhost:3042/blog", {
        method: "PUT",
        body: formData, // Sender data i formData-format
      });

      if (!response.ok) {
        throw new Error(`Kunne ikke opdatere blog: ${response.status}`);
      }

      const result = await response.json(); // Henter resultatet fra serveren
      await fetchBlogs(); // Genindlæser blogdataene
      return result; // Returnerer den opdaterede blog
    } catch (err) {
      throw err; // Kaster fejl videre
    } finally {
      setLoading(false); // Sætter loading til false når opdatering er færdig
    }
  };

  // Funktion til at slette en blog
  const deleteBlog = async (id) => {
    if (!id) {
      throw new Error("Blog ID er påkrævet for sletning"); // Hvis ID ikke findes, kast fejl
    }

    try {
      setLoading(true); // Sætter loading til true under sletning
      const response = await fetch(`http://localhost:3042/blog/${id}`, {
        method: "DELETE", // Sletter bloggen med en DELETE-request
      });

      if (!response.ok) {
        throw new Error(`Kunne ikke slette blog: ${response.status}`);
      }

      let result;
      try {
        result = await response.json(); // Henter resultatet fra serveren
      } catch (e) {
        result = { success: true }; // Hvis der er fejl i JSON parsing, antager vi succes
      }

      await fetchBlogs(); // Genindlæser blogdataene
      return result; // Returnerer resultatet af sletningen
    } catch (err) {
      throw err; // Kaster fejl videre
    } finally {
      setLoading(false); // Sætter loading til false når sletning er færdig
    }
  };

  // Returnerer alle funktioner og tilstande fra hooken så de kan bruges i komponenten
  return {
    data,         
    loading,      
    error,         
    refetch: fetchBlogs, 
    createBlog,    
    updateBlog,    
    deleteBlog,    
  };
};

export default useBlogs; 