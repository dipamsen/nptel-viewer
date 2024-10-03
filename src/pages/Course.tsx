import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { CourseInfo, Lesson } from "../types";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import { Star, StarBorder } from "@mui/icons-material";

function App() {
  const [course, setCourse] = useState<CourseInfo>();
  const [loading, setLoading] = useState(false);
  const [lessonId, setLessonId] = useState<number>(0);
  const [expandVideo, setExpandVideo] = useState(false);
  const { id } = useParams<{
    id: string;
  }>();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`https://nptel.deno.dev/course?id=${id}`);
      const data: CourseInfo = await res.json();
      setCourse(data);
      setLoading(false);
    }
    setLoading(true);
    fetchData();
  }, []);

  useEffect(() => {
    if (!id) return;
    const favorites = localStorage.getItem("nptel-favorites");
    if (favorites) {
      const favs = JSON.parse(favorites) as string[];
      setIsFavorite(favs.includes(id));
    } else {
      setIsFavorite(false);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    const favorites = localStorage.getItem("nptel-favorites");
    if (favorites) {
      const favs = JSON.parse(favorites) as string[];
      if (isFavorite) {
        if (!favs.includes(id)) {
          favs.push(id);
        }
      } else {
        const index = favs.indexOf(id);
        if (index > -1) {
          favs.splice(index, 1);
        }
      }
      localStorage.setItem("nptel-favorites", JSON.stringify(favs));
    } else {
      if (isFavorite) {
        localStorage.setItem("nptel-favorites", JSON.stringify([id]));
      }
    }
  }, [isFavorite]);

  useEffect(() => {
    if (course) {
      document.title = `${course.title} | NPTEL Courses`;
    }
  }, [course]);

  function removeNonPrintableCharacters(str: string) {
    return str.replaceAll("\n", "<br />").replace(/[^\x20-\x7E]/g, "");
  }
  console.log(course);

  const star = (
    <Checkbox
      aria-label="star"
      // size="medium"
      checked={isFavorite}
      onChange={() => setIsFavorite(!isFavorite)}
      icon={<StarBorder scale={4} />}
      checkedIcon={<Star scale={4} />}
    />
  );

  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: "20px" }}>
        {loading && <CircularProgress />}

        {!loading &&
          course &&
          (() => {
            const lessons: Lesson[] = [
              course.introVideoId
                ? {
                    id: 0,
                    name: "Course Introduction",
                    // description: removeNonPrintableCharacters(course.abstract),
                    videoId: course.introVideoId,
                  }
                : null,
              ...course.chapters.map((chapter) => chapter.lessons).flat(),
            ].filter(Boolean) as Lesson[];
            const weeks = [
              course.introVideoId
                ? { title: "Introduction", lessons: [lessons[0]] }
                : null,
              ...course.chapters.map((chapter) => ({
                title: chapter.name,
                lessons: chapter.lessons,
              })),
            ].filter(Boolean) as { title: string; lessons: Lesson[] }[];
            return (
              <Box>
                <Typography variant="h3">
                  {course.title}

                  {star}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.professor}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} my={2}>
                  <Avatar
                    src={course.instituteLogo}
                    alt={course.institute}
                    sx={{ bgcolor: "white" }}
                  />
                  <Typography variant="body2">{course.institute}</Typography>
                </Box>
                {course.syllabus && (
                  <Button
                    variant="outlined"
                    href={course.syllabus}
                    target="_blank"
                    sx={{ marginRight: "10px" }}
                  >
                    Syllabus
                  </Button>
                )}
                <Button
                  variant="outlined"
                  href={`https://nptel.ac.in/courses/${course.id}`}
                  target="_blank"
                  sx={{ marginRight: "10px" }}
                >
                  NPTEL Page
                </Button>

                {!isMobile && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={expandVideo}
                        onChange={() => setExpandVideo(!expandVideo)}
                      />
                    }
                    label="Expand Video"
                  />
                )}
                {course.abstract && (
                  <Box>
                    <Typography
                      variant="body1"
                      dangerouslySetInnerHTML={{
                        __html: removeNonPrintableCharacters(course.abstract),
                      }}
                    />
                  </Box>
                )}
                <Box
                  display="flex"
                  gap={2}
                  my={2}
                  height={
                    isMobile ? undefined : expandVideo ? "600px" : "480px"
                  }
                  flexDirection={isMobile ? "column" : "row"}
                >
                  <Box width={"100%"} height={isMobile ? "300px" : "100%"}>
                    {lessons[lessonId].videoId ? (
                      <YouTube
                        videoId={lessons[lessonId].videoId}
                        opts={{
                          width: "100%",
                          height: "100%",
                        }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : lessons[lessonId].lectureLink ? (
                      <iframe
                        src={lessons[lessonId].lectureLink}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : null}
                  </Box>
                  {!expandVideo && (
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      gap={2}
                      width={"100%"}
                      height={"100%"}
                    >
                      <Box
                        gap={2}
                        my={2}
                        width="100%"
                        overflow={"auto"}
                        height={isMobile ? "400px" : "100%"}
                      >
                        <List dense>
                          {weeks.map((week) => (
                            <>
                              <ListSubheader
                                disableSticky
                                sx={{
                                  backgroundColor: "#333",
                                }}
                              >
                                {week.title.toUpperCase()}
                              </ListSubheader>
                              {week.lessons.map((lesson) => (
                                // <ListItem key={lessons.indexOf(lesson)}>
                                <ListItemButton
                                  key={lesson.name}
                                  selected={
                                    lesson.name === lessons[lessonId].name
                                  }
                                  onClick={() =>
                                    setLessonId(lessons.indexOf(lesson))
                                  }
                                >
                                  <ListItemText primary={lesson.name} />
                                </ListItemButton>
                                // </ListItem>
                              ))}
                            </>
                          ))}
                        </List>
                      </Box>
                      <Box display="flex" gap={2} width="100%">
                        <Button
                          sx={{ width: "100%" }}
                          variant="outlined"
                          onClick={() =>
                            setLessonId((lessonId - 1) % lessons.length)
                          }
                          disabled={lessonId === 0}
                        >
                          Previous
                        </Button>
                        <Button
                          sx={{ width: "100%" }}
                          variant="outlined"
                          onClick={() =>
                            setLessonId((lessonId + 1) % lessons.length)
                          }
                          disabled={lessonId === lessons.length - 1}
                        >
                          Next
                        </Button>
                      </Box>
                    </Box>
                  )}
                  {/* right info */}
                </Box>
                {/* yt area */}
                {expandVideo && (
                  <Box display="flex" gap={2} width="100%">
                    <Button
                      sx={{ width: "100%" }}
                      variant="outlined"
                      onClick={() =>
                        setLessonId((lessonId - 1) % lessons.length)
                      }
                      disabled={lessonId === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      sx={{ width: "100%" }}
                      variant="outlined"
                      onClick={() =>
                        setLessonId((lessonId + 1) % lessons.length)
                      }
                      disabled={lessonId === lessons.length - 1}
                    >
                      Next
                    </Button>
                  </Box>
                )}

                <Box sx={{ width: "100%" }} my={2}>
                  <Typography variant="h5">{lessons[lessonId].name}</Typography>
                  <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{
                      __html: lessons[lessonId].description,
                    }}
                  />
                </Box>

                {/* <Typography variant="h5" sx={{ marginTop: "20px" }}>
                  Assignments
                </Typography>
                {course.downloadables.assignments.map((assignment) => (
                  <Box key={assignment.title} display={"flex"} gap={2}>
                    <Typography variant="body1">{assignment.title}</Typography>
                    <Button
                      variant="outlined"
                      href={assignment.url}
                      target="_blank"
                    >
                      Download
                    </Button>
                    <Divider />
                  </Box>
                ))} */}
              </Box>
            );
          })()}
      </Container>
    </>
  );
}

export default App;
