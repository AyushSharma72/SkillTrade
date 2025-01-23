  // Unassign modal

  // const [unassignModal, SetunassignModal] = useState(false);

    // const [description, setDescription] = useState("");


  //  const handleChange = (event) => {
  //    if (event.target.value.length <= 100) {
  //      setDescription(event.target.value);
  //    }
  //  };


  // <Modal
  //   open={unassignModal}
  //   onClose={() => {
  //     SetunassignModal(false);
  //   }}
  // >
  //   <Box sx={style} className="flex flex-col gap-2">
  //     <p className="font-bold text-center">
  //       Are you sure you want to unassign this worker ?
  //     </p>{" "}
  //     <div>
  //       {" "}
  //       <Textarea
  //         name="description"
  //         placeholder="Type reason"
  //         value={description}
  //         onChange={handleChange}
  //         className="w-full h-20 overflow-y-scroll scrollbar-hide"
  //         required
  //       />
  //       <p className="text-gray-400">
  //         {100 - description.length} characters remaining
  //       </p>
  //     </div>
  //     <Button
  //       onClick={(e) => {
  //         UnassignWorker(e, data.assignedTo?._id);
  //       }}
  //     >
  //       Unassign
  //     </Button>
  //     <Button
  //       onClick={() => {
  //         SetunassignModal(false);
  //       }}
  //     >
  //       Cancel
  //     </Button>
  //   </Box>
  // </Modal>;












  // async function UnassignWorker(e, wid) {
  //   e.preventDefault();
  //   if (!description || description.length < 30) {
  //     toast.error("please give description of atleast 30 characters");
  //     return;
  //   }
  //   try {
  //     setFetchLoading(true);
  //     const response = await UnAssign(rid, wid, description);
  //     const data = await response.json();
  //     if (response.status === 200) {
  //       toast.success(data.message);
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("error making this request");
  //   } finally {
  //     SetunassignModal(false);
  //     setDescription("");
  //     GetData();
  //     setFetchLoading(false);
  //   }
  // }


  // server modal 

  //  UnAssignedRequest: [
  //     {
  //       request: {
  //         type: Schema.Types.ObjectId,
  //         ref: "Requests",
  //       },
  //       unassignReason: {
  //         type: String,
  //         default: null,
  //       },
  //       unassignesAt: {
  //         type: Date,
  //         default: null,
  //       },
  //     },
  //   ],