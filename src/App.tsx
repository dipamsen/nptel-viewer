import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Header from "./components/Header";
import CourseCard from "./components/CourseCard";

export type Course = {
  id: string;
  title: string;
  institute: string;
  contentType: string;
  professor: string;
  subject: string;
  currentRun: number;
};

const coursePerPage = 30;

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [professor, setProfessor] = useState("");
  const [subject, setSubject] = useState<string[]>([]);
  const [institute, setInstitute] = useState<string[]>([]);
  const [contentType, setContentType] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [favIDs, setFavIDs] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("https://nptel.deno.dev/");
      const data: Course[] = await res.json();
      const c = data.map((d) => ({
        ...d,
        title: d.title.startsWith("NOC:") ? d.title.slice(4) : d.title,
      }));
      setCourses(c);
      setFilteredCourses(c);
      setLoading(false);
    }
    setLoading(true);
    fetchData();
  }, []);

  // set filter
  useEffect(() => {
    setFilteredCourses(courses);
    if (search) {
      setFilteredCourses((courses) =>
        courses.filter((c) =>
          c.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    if (professor) {
      setFilteredCourses((courses) =>
        courses.filter((c) =>
          c.professor.toLowerCase().includes(professor.toLowerCase())
        )
      );
    }
    if (subject.length > 0) {
      setFilteredCourses((courses) =>
        courses.filter((c) => subject.includes(c.subject))
      );
    }
    if (institute.length > 0) {
      setFilteredCourses((courses) =>
        courses.filter((c) => institute.includes(c.institute))
      );
    }
    if (contentType.length > 0) {
      setFilteredCourses((courses) =>
        courses.filter((c) => contentType.includes(c.contentType))
      );
    }
  }, [search, professor, subject, institute, contentType]);

  useEffect(() => {
    const favIDs = JSON.parse(localStorage.getItem("nptel-favorites") || "[]");
    setFavIDs(favIDs);
  }, []);

  useEffect(() => {
    localStorage.setItem("nptel-favorites", JSON.stringify(favIDs));
  }, [favIDs]);

  const toggleFav = (id: string) => {
    if (favIDs.includes(id)) {
      setFavIDs(favIDs.filter((i) => i !== id));
    } else {
      setFavIDs([...favIDs, id]);
    }
  };

  const institutes = Array.from(
    new Set(courses.map((c) => c.institute))
  ).filter((i) => i);
  const subjects = Array.from(new Set(courses.map((c) => c.subject))).filter(
    (s) => s
  );
  const contentTypes = Array.from(
    new Set(courses.map((c) => c.contentType))
  ).filter((ct) => ct);

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: "20px" }}>
        {!loading && (
          <>
            <Typography variant="h3" sx={{ marginBottom: "20px" }}>
              Favorites
            </Typography>
            <Box
              display={"grid"}
              gridTemplateColumns={"repeat(auto-fill, minmax(300px, 1fr))"}
              rowGap={2}
              columnGap={2}
              sx={{ marginBottom: 2 }}
            >
              {courses
                .filter((c) => favIDs.includes(c.id))
                .map((course) => (
                  <CourseCard
                    course={course}
                    isFavourite={true}
                    toggleFav={() => toggleFav(course.id)}
                    key={course.id}
                  />
                ))}

              {favIDs.length === 0 && (
                <Typography sx={{ mb: 2 }}>No courses starred.</Typography>
              )}
            </Box>
          </>
        )}

        <Typography variant="h3" sx={{ marginBottom: "20px" }}>
          All Courses
        </Typography>
        {loading && <CircularProgress />}

        {/* filters - name search, professor search, subject dropdown, institute dropdown, content type dropdown */}
        {!loading && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 2,
                marginBottom: 2,
                width: "100%",
                // justifyContent: "space-between",
              }}
            >
              <TextField
                label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
              />
              <TextField
                label="Professor"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
              />
              <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                <InputLabel id="subject-label">Subject</InputLabel>
                <Select
                  labelId="subject-label"
                  id="subject"
                  value={subject}
                  label="Subject"
                  onChange={(e) => setSubject(e.target.value as string[])}
                  multiple
                >
                  {subjects.map((subject) => (
                    <MenuItem value={subject} key={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ minWidth: 180 }}>
                <InputLabel id="institute-label">Institute</InputLabel>
                <Select
                  labelId="institute-label"
                  id="institute"
                  value={institute}
                  label="Institute"
                  onChange={(e) => setInstitute(e.target.value as string[])}
                  multiple
                >
                  {institutes.map((institute) => (
                    <MenuItem value={institute} key={institute}>
                      {institute.slice(0, 40)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="content-type-label">Type</InputLabel>
                <Select
                  labelId="content-type-label"
                  id="content-type"
                  value={contentType}
                  label="Type"
                  onChange={(e) => setContentType(e.target.value as string[])}
                  multiple
                >
                  {contentTypes.map((contentType) => (
                    <MenuItem value={contentType} key={contentType}>
                      {contentType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box width="100%" display="flex" justifyContent="center" my={1}>
              <Pagination
                count={Math.ceil(filteredCourses.length / coursePerPage)}
                page={page}
                onChange={(_e, value) => setPage(value)}
                shape="rounded"
                size="large"
              />
            </Box>
          </>
        )}

        <Box
          display={"grid"}
          gridTemplateColumns={"repeat(auto-fill, minmax(300px, 1fr))"}
          rowGap={2}
          columnGap={2}
        >
          {!loading &&
            filteredCourses
              .slice((page - 1) * coursePerPage, page * coursePerPage)
              .map((course: Course) => (
                <CourseCard
                  course={course}
                  isFavourite={favIDs.includes(course.id)}
                  toggleFav={() => toggleFav(course.id)}
                  key={course.id}
                />
              ))}

          {filteredCourses.length === 0 && !loading && (
            <Typography>No courses found</Typography>
          )}
        </Box>

        {!loading && (
          <Box width="100%" display="flex" justifyContent="center" my={1}>
            <Pagination
              count={Math.ceil(filteredCourses.length / coursePerPage)}
              page={page}
              onChange={(_e, value) => setPage(value)}
              shape="rounded"
              size="large"
            />
          </Box>
        )}
      </Container>
    </>
  );
}

export default App;
