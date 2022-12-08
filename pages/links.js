import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import {
  Container,
  Button,
  FormControl,
  InputGroup,
  Dropdown,
  DropdownButton,
  Form,
} from "react-bootstrap";
import Navbar from "../lib/components/Navbar";
import LinkView from "../lib/components/LinkView";
import Footer from "../lib/components/Footer";
import priorities from "../lib/priorities";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Component() {
  const [blockScroll, setBlockScroll] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState([]);

  const { data: session, status } = useSession();
  const loading = status === "loading";

  const router = useRouter();

  const { data, error, isValidating, mutate } = useSWR("/api/links/list", fetcher);

  if (!loading && !session)
    signIn({
      callbackUrl: "/links",
    });
  if (error) console.error(error);

  useEffect(() => {
    const onScroll = () => {
      if (blockScroll) return;

      const links = document.querySelectorAll(".link");

      const current = Array.from(links).find((link) => {
        const rect = link.getBoundingClientRect();
        return rect.bottom >= 0 && rect.bottom <= window.innerHeight;
      });

      const prev = current;

      if (prev) {
        const id = prev.getAttribute("id");
        const date = prev.getAttribute("data-date");
        window.history.replaceState(null, null, `#${date}-${id}`);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [blockScroll]);

  useEffect(() => {
    const id = window.location.hash.slice(1).split("-")[1];
    if (id) {
      const link = document.getElementById(id);
      if (link) link.scrollIntoView();
    }

    setBlockScroll(false);
  }, [data]);

  if (loading) return <>loading...</>;
  if (!session) return <>signing in...</>;
  if (error) return <>failed to load</>;

  const links = data?.links || [];
  let linksByDate = links
    .sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .reduce((acc, link) => {
      const date = new Date(link.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(link);
      return acc;
    }, {});

  return (
    <Container className="md-container">
      <Navbar />

      <InputGroup className="mb-3 mt-3">
        <Form.Control
          placeholder="Type to filter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <DropdownButton
          align="end"
          variant="outline-secondary"
          title="Filter by type"
          autoClose="outside"
          id="input-group-dropdown-1"
        >
          {priorities
            .map((x) => ({ ...x, key: x.id.split("-")[1] }))
            .map((priority) => (
              <Dropdown.Item
                key={priority.id}
                onClick={() => {
                  if (type.includes(priority.key)) {
                    setType(type.filter((t) => t !== priority.key));
                  } else {
                    setType([...type, priority.key]);
                  }
                }}
                className={type.includes(priority.key) ? "active" : ""}
              >
                {priority.label}
              </Dropdown.Item>
            ))}
          <Dropdown.Item
            onClick={() => {
              if (type.includes("archived")) {
                setType(type.filter((t) => t !== "archived"));
              } else {
                setType([...type, "archived"]);
              }
            }}
            className={type.includes("archived") ? "active" : ""}
          >
            Archived
          </Dropdown.Item>
          {(type.length > 0 || search.length > 0) && (
            <>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={() => {
                  setType([]);
                  setSearch("");
                }}
              >
                Clear
              </Dropdown.Item>
            </>
          )}
        </DropdownButton>
      </InputGroup>

      {Object.entries(linksByDate).map(([date, links]) => (
        <div key={date}>
          <h3>{date}</h3>
          <Container>
            {links
              .filter((link) => {
                const title = link.title.toLowerCase();
                const url = link.url.toLowerCase();
                const notes = link.notes.toLowerCase();
                const searchStr = search.toLowerCase();

                const stringFilter =
                  title.includes(searchStr) ||
                  url.includes(searchStr) ||
                  notes.includes(searchStr) ||
                  searchStr === "";

                const priorityFilter = type.includes(
                  priorities[link.priority].id.split("-")[1]
                );

                const typeFilter = link.archived
                  ? type.includes("archived") || priorityFilter
                  : type.length === 0 || priorityFilter;

                return stringFilter && typeFilter;
              })
              .map((link) => (
                <LinkView date={date} link={link} key={link.id} revalidate={mutate} />
              ))}
          </Container>
        </div>
      ))}
      {links.length === 0 && !isValidating && (
        <div className="text-center">
          <h2>No links yet</h2>
          <p>Click the button below to add your first link</p>
          <Button variant="primary" onClick={() => router.push("/")}>
            Create a link
          </Button>
        </div>
      )}
      <Footer />
    </Container>
  );
}
