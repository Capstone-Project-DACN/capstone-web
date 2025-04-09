import {
  Box,
  Typography,
  Chip,
  styled,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import DeviceListItem from "@/app/(control-panel)/device/components/components/DeviceListItem";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getDeviceByTopic, getDeviceTopics } from "../../store/deviceSlice";
import { useSelector } from "react-redux";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};

const StickyHeader = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.default,
  zIndex: 10,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
}));

const OverviewTab = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchParams = new URLSearchParams(window.location.search);
  const topicParam = searchParams.get("topic");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const topics = useSelector(
    (state: any) => state?.device?.deviceSlice?.topics
  );
  const data = useSelector((state: any) => state?.device?.deviceSlice?.data);
  const selectedDevices = useSelector((state: any) => state?.device?.deviceSlice?.selectedDevices);
  const filteredTopics = searchText.length === 0 ? topics : topics.filter((item: any) => {
    return item.topic.toLowerCase().includes(searchText.toLowerCase());
  });
  
  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
    const updatedParams = new URLSearchParams(window.location.search);
    updatedParams.set("search", e.target.value);
    navigate(`/device/overview?${updatedParams.toString()}`);
  };

  useEffect(() => {
    setSearchText(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setTableLoading(true);
    dispatch(getDeviceTopics({}))
      .then((res) => {
        if (!topicParam && res.payload.topics.length > 0)
          navigate(`/device/overview?topic=${res.payload?.topics[0].topic}`);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (topicParam) {
      setTableLoading(true);
      setTimeout(() => {
        dispatch(getDeviceByTopic({ topic: topicParam }))
          .then((res) => {
            setTableLoading(false);
          })
          .finally(() => {
            setTableLoading(false);
          });
      }, 300);
    }
  }, [topicParam]);

  if (loading) return <FuseLoading />;

  return (
    <motion.div
      key="districts"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full flex justify-between gap-x-5 relative"
    >
      <Box className="w-1/4 h-full overflow-y-auto scrollbar-hide relative">
        <Box className="flex z-40 top-0 gap-x-2 items-stretch w-full sticky h-12" sx={{ backgroundColor: theme.palette.background.paper }}>
          <TextField
            id="outlined-basic"
            value={searchText}
            onInput={handleSearch}
            placeholder="Search"
            autoComplete="off"
            sx={{
              "& .MuiOutlinedInput-root": {
                paddingTop: "0px",
              },
            }}
            variant="outlined"
            className="w-full rounded-sm border-none"
          />
          <Button
            className="rounded-sm"
            onClick={() => {
              setSearchText("");
              const updatedParams = new URLSearchParams(window.location.search);
              updatedParams.delete("search");
              navigate(`/device/overview?${updatedParams.toString()}`); 
            }}
          >
            Clear
          </Button>
        </Box>
        <Box className="flex flex-col">
          <AnimatePresence>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredTopics?.map((topic: any) => {
                const updatedParams = new URLSearchParams(
                  window.location.search
                );
                updatedParams.set("topic", topic.topic);
                return (
                  <motion.div key={topic.id} variants={itemVariants}>
                    <Box
                      role="button"
                      key={topic.id}
                      component={Link}
                      to={`/device/overview?${updatedParams.toString()}`}
                      className={`flex items-center justify-between px-1 py-4 cursor-pointer border-b`}
                      sx={{
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                        backgroundColor:
                          topicParam === topic.topic
                            ? theme.palette.action.hover
                            : "",
                      }}
                    >
                      {topic?.topic.split("_")[0] === "household" && (
                        <FuseSvgIcon
                          className="text-7xl"
                          size={18}
                          color={"info"}
                        >
                          heroicons-outline:building-office
                        </FuseSvgIcon>
                      )}

                      {topic?.topic.split("_")[0] === "area" && (
                        <FuseSvgIcon
                          className="text-7xl"
                          size={18}
                          color={"info"}
                        >
                          heroicons-outline:globe-asia-australia
                        </FuseSvgIcon>
                      )}

                      {topic?.topic.split("_")[0] === "anomaly" && (
                        <FuseSvgIcon
                          className="text-7xl"
                          size={18}
                          color={"info"}
                        >
                          heroicons-outline:bug-ant
                        </FuseSvgIcon>
                      )}

                      <Typography
                        variant="body1"
                        fontWeight={topicParam === topic.topic ? 500 : 400}
                        className="line-clamp-1 trucate w-[65%] pl-2"
                      >
                        {topic?.topic}
                      </Typography>
                      <Chip
                        size="small"
                        label={`${topic?.number_of_devices} devices`}
                        color={
                          topicParam === topic.topic ? "secondary" : "default"
                        }
                      />
                    </Box>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      <Box className="w-3/4 h-full rounded-md overflow-y-auto scrollbar-hide">
        <Box className="flex items-start justify-between mb-4 w-full h-full">
          {loading ? (
            <FuseLoading />
          ) : !topicParam ? (
            <Box className="flex items-center justify-center w-full border border-dashed border-gray-400 rounded-md h-60">
              <Typography variant="body1" color="text.secondary">
                Please select a topic from the left panel
              </Typography>
            </Box>
          ) : (
            <AnimatePresence>
              <motion.div
                key="inactive"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full h-full overflow-y-auto scrollbar-hide"
              >
                <StickyHeader className="border-t border-r border-l rounded-t-md">
                  <motion.div
                    className="flex items-center font-semibold justify-between h-12 px-4 text-blue-600 uppercase"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-3/12 pl-2">Device ID</div>
                    <div className="w-2/12">Usage</div>
                    <div className="w-2/12">Last seen</div>
                    <div className="w-2/12">Current</div>
                    <div className="w-2/12">Voltage</div>
                  </motion.div>
                </StickyHeader>
                {!tableLoading && data?.length > 0 ? (
                  <Box>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col"
                    >
                      {data?.map((device: any) => (
                        <DeviceListItem
                          key={device?.device_id}
                          device={device}
                          isSelected={selectedDevices.includes(device?.device_id)}
                        />
                      ))}
                    </motion.div>
                  </Box>
                ) : (
                  data?.length === 0 ? (
                    <Box className="flex items-center justify-center w-full h-20">
                      <Typography variant="body1" color="text.secondary">
                        No devices found
                      </Typography>
                    </Box>
                  ) : 
                  <FuseLoading />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default OverviewTab;
