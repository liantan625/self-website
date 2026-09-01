import { useEffect, useMemo, useState } from "react";
import {
  fetchCmsPosts,
  fetchCmsSession,
  fetchPublishedCmsPosts,
  getErrorMessage,
  loginCms,
  logoutCms,
  type CmsSession,
} from "../lib/cmsApi";
import { getRepoPostBySlug, getRepoPosts } from "../lib/posts";
import type { BlogPost } from "../types";

const repoPosts = getRepoPosts();
const EMPTY_POSTS: BlogPost[] = [];
const ANONYMOUS_SESSION: CmsSession = { authenticated: false, username: null };

function sortByDate(posts: typeof repoPosts) {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function useCmsPosts(includeDrafts = true, enabled = true) {
  const [posts, setPosts] = useState<BlogPost[]>(EMPTY_POSTS);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setPosts(EMPTY_POSTS);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;
    setLoading(true);

    const loader = includeDrafts ? () => fetchCmsPosts(true) : fetchPublishedCmsPosts;
    void loader().then(
      (nextPosts) => {
        if (cancelled) {
          return;
        }
        setPosts(nextPosts);
        setError("");
        setLoading(false);
      },
      (nextError) => {
        if (cancelled) {
          return;
        }
        setPosts(EMPTY_POSTS);
        setError(getErrorMessage(nextError));
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [enabled, includeDrafts, refreshKey]);

  return {
    posts,
    loading,
    error,
    reload: () => setRefreshKey((current) => current + 1),
  };
}

export function usePublishedPosts() {
  const cms = useCmsPosts(false, true);
  const cmsPosts = Array.isArray(cms.posts) ? cms.posts : EMPTY_POSTS;

  return {
    posts: useMemo(() => sortByDate([...repoPosts, ...cmsPosts]), [cmsPosts]),
    loading: cms.loading,
    error: cms.error,
  };
}

export function usePublishedPost(slug: string) {
  const { posts, loading, error } = usePublishedPosts();
  const post = useMemo(() => posts.find((item) => item.slug === slug), [posts, slug]);

  return { post, loading, error };
}

export function useCmsSession() {
  const [session, setSession] = useState<CmsSession>(ANONYMOUS_SESSION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    void fetchCmsSession().then(
      (nextSession) => {
        if (cancelled) {
          return;
        }
        setSession({
          authenticated: Boolean(nextSession?.authenticated),
          username: typeof nextSession?.username === "string" ? nextSession.username : null,
        });
        setError("");
        setLoading(false);
      },
      (nextError) => {
        if (cancelled) {
          return;
        }
        setSession(ANONYMOUS_SESSION);
        setError(getErrorMessage(nextError));
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    session,
    loading,
    error,
    login: async (username: string, password: string) => {
      const nextSession = await loginCms(username, password);
      setSession({
        authenticated: Boolean(nextSession?.authenticated),
        username: typeof nextSession?.username === "string" ? nextSession.username : null,
      });
      setError("");
      return nextSession;
    },
    logout: async () => {
      await logoutCms();
      setSession(ANONYMOUS_SESSION);
    },
  };
}

export function isRepoSlug(slug: string) {
  return Boolean(getRepoPostBySlug(slug));
}

export function getRepoPostCount() {
  return repoPosts.length;
}
