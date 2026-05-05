import { useState, useEffect, useRef } from "react";
import { applicationAPI, getErrorMessage } from "../utils/api";
import { ResolverResultCard } from "../components/ResolverResultCard";
import { FloatingResolverButton } from "../components/FloatingResolverButton";
import { Header } from "../components/Header";
import { Search, Lightbulb, X } from "lucide-react";
import "./Resolver.css";

export const ResolverPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!searchQuery.trim()) { setResults([]); setSearching(false); return; }

    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setError("");
        const response = await applicationAPI.search(searchQuery);
        setResults(response.data.applications || []);
      } catch (err) {
        setError(getErrorMessage(err));
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [searchQuery]);

  return (
    <div className="resolver-container">
      <Header title="Recruiter Called?" />

      <div className="resolver-inner">
        <div className="resolver-header">
          <h1>Who just <span>called you?</span></h1>
          <p>Search the company name or role — find your resume in seconds</p>
        </div>

        <div className="resolver-search-section">
          <div className="resolver-search-wrapper">
            <Search size={20} className="resolver-search-icon" />
            <input
              type="text"
              placeholder="Type company name or job role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="resolver-search-input"
              autoFocus
            />
            {searching && <span className="resolver-search-indicator">Searching...</span>}
          </div>
        </div>

        {error && (
          <div className="resolver-error-banner">
            <p>{error}</p>
            <button onClick={() => setError("")}>✕</button>
          </div>
        )}

        {searchQuery.trim() && (
          <div className="resolver-results">
            {results.length === 0 && !searching ? (
              <div className="resolver-empty-state">
                <div className="resolver-empty-icon"><Search size={28} /></div>
                <h3>No results found</h3>
                <p>Try searching with a different company name or role</p>
              </div>
            ) : (
              <div className="resolver-results-grid">
                {results.map((app) => (
                  <ResolverResultCard key={app._id} application={app} />
                ))}
              </div>
            )}
          </div>
        )}

        {!searchQuery.trim() && (
          <div className="resolver-hint">
            <div className="resolver-hint-icon"><Lightbulb size={24} /></div>
            <h3>Quick Tip</h3>
            <ul>
              <li>Type a company name to find your application instantly</li>
              <li>Or search by the job role you applied for</li>
              <li>Preview or download your resume with one click</li>
            </ul>
          </div>
        )}
      </div>

      <FloatingResolverButton />
    </div>
  );
};
