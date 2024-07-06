import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { CourseInfo, Lesson } from "../types";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";

function App() {
  const [course, setCourse] = useState<CourseInfo>();
  const [loading, setLoading] = useState(false);
  const [lessonId, setLessonId] = useState<number>(0);
  const { id } = useParams<{
    id: string;
  }>();

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

  function removeNonPrintableCharacters(str: string) {
    return str.replaceAll("\n", "<br />").replace(/[^\x20-\x7E]/g, "");
  }

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
              {
                id: 0,
                name: "Course Introduction",
                description: removeNonPrintableCharacters(course.abstract),
                videoId: course.introVideoId,
              },
              ...course.chapters.map((chapter) => chapter.lessons).flat(),
            ];
            const weeks = [
              { title: "Introduction", lessons: [lessons[0]] },
              ...course.chapters.map((chapter) => ({
                title: chapter.name,
                lessons: chapter.lessons,
              })),
            ];
            return (
              <Box>
                <Typography variant="h3">{course.title}</Typography>
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
                  >
                    Syllabus
                  </Button>
                )}
                <Box
                  display="flex"
                  gap={2}
                  my={2}
                  height={isMobile ? undefined : "480px"}
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
                  {/* right info */}
                </Box>
                {/* yt area */}

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
