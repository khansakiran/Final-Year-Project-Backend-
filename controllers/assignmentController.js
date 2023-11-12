var User = require("../models/user");
var AsyncHandler = require("express-async-handler");
var generateToken = require("../Utills/generateToken");
var Teacher = require("../models/teacher");
var Assignment = require('../models/assignment');
var Course= require("../models/course");
var TestCase = require("../models/testCase")
const { Types } = require('mongoose');
const Question = require("../models/question");
const fs = require('fs');
const PDFDocument = require('pdfkit');

const question = require("../models/question");


const addAssignment = AsyncHandler(async (req, res, next) => {
  const { questions, assig //receive usestate herre
  } = req.body;

  
  const totalMarks = questions.reduce(
    (total, quest) => total + quest.questionTotalMarks,
    0
  );
  // Parse the dueTime from the frontend as a JavaScript Date object
  const dueTime = new Date(assig.dueTime);

  const data = {
    CourseID: assig.CourseID,
    assignmentNumber: assig.assignmentNumber,
    description: assig.description,
    uploadDate: new Date(),
    dueDate: new Date(assig.dueDate),
    dueTime: dueTime, // Use the parsed date directly
    totalMarks: totalMarks,
    format: assig.format,
    noOfQuestions: assig.noOfQuestions,
  };

  try {
    const assignment = await Assignment.create(data);


    questions.map(async (quest) => {
      const question = await Question.create({
        Assignment: assignment._id,
        questionDescription: quest.questionDescription,
        questionTotalMarks: quest.questionTotalMarks,
        isInputArray: quest.isInputArray,
      });

      quest.testCases.map(async (testCases) => {
        const testCase = await TestCase.create({
          Question: question._id,
          ...testCases,
          //arraysize:useState
        });
      });
    });


    res.send({ success: true });
  } catch (error) {
    console.log("Error:", error);
    res.send({ success: false });
  }
});


const editAssignment = AsyncHandler(async(req,res,next)=>{
  
  const {assigId,assignmentNumber,description,uploadDate,dueDate,totalMarks,assignmentFile,format} = req.body;
  //const assignment= await Assignment.findById(assigId)
  try{
  const assignment = await Assignment.updateOne(
    {_id : assigId},
    {
      assignmentNumber : assignmentNumber ,


    description : description ,
    uploadDate : uploadDate ,
    dueDate : dueDate ,
    totalMarks : totalMarks ,
    assignmentFile : assignmentFile ,
   format : format 

    }
  )
    
    res.json({ success: `Assignment successfully updated! ` });
  }
  catch(err) {
    res.send({ message: err });
  }
})
const deleteAssignment = AsyncHandler(async(req, res, next) => {
    const assignmentid = req.params.aid;
    const courseid = req.params.cid;
    if (!Types.ObjectId.isValid(courseid)) {
      res.status(400).json({ error: 'Invalid courseid' });
      return;
    }
    Course.updateOne(
      { _id: courseid },
      {
        $pull: {
         // assignments: { assignmentID: assignmentid },
            assignments: { _id: assignmentid } ,

        },
      },
      (err, result) => {
        if (err) {
          res.status(501);
          res.json({ error: err });
          return;
        }
      }
    )
      const deletedAssignment = await Assignment.findOneAndDelete({ _id: assignmentid });
      res.status(200);
      res.json({ success: "Assignment remved from course" });
  })


  const viewSubmittedList = AsyncHandler(
    async(req,res,next)=>{
      const assignmentID = req.body
      const assignment = await Assignment.findById(assignmentID).populate({
        path:'submittedAssignment',
        model:'Submission',
        populate:{
          path:'student testResults plagairismReport',
          model:'Student TestResult PlagairismReport'
        }
      })
      res.status(200).json({
        submissions: assignment.submittedAssignment
      })
    }
  )

const viewAssignmentList = AsyncHandler(
  async(req,res,next) => {

  try {
    
      const assig = await Assignment.find({   CourseID: req.params.cid });
      const setAssignments = assig.map((a)=> {
        return {
          _id : a._id,
          CourseID:a.CourseID,
          assignmentNumber:a.assignmentNumber,
          description:a.description,
          uploadDate:a.uploadDate.toISOString().split('T')[0],
          dueDate:a.dueDate.toISOString().split('T')[0],
          dueTime:a.dueTime,
          totalMarks:a.totalMarks,
          format:a.format,
          noOfQuestions:a.noOfQuestions
        }
      })
      res.json({assignments: setAssignments});
  } catch (error) {
    console.error(error);
  }
    

  }
)

/*const viewAssignment = AsyncHandler(async (req, res, next) => {
  const assignmentId = req.params.aid;

  try {
    
    const assignment = await Assignment.findById(assignmentId);
    

    const questions = await question.find({Assignment : assignmentId})


    const testcasesWithQuestions = [];

    const getTestCases = async (question) => {
      const findTestCase = await TestCase.find({ Question: question._id });
      return findTestCase;
    };
    
    const updateTestCases = async () => {
      for (const question of questions) {
        const testCases = await getTestCases(question);
        const questionWithTestCases = {
          ...question,
          testCases: testCases,
        };
        testcasesWithQuestions.push(questionWithTestCases);
      }

    };
    
    updateTestCases();
    
    
   
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

   
    const pdfDoc = new PDFDocument();
    
    pdfDoc.font('Helvetica-Bold').fontSize(25).text(`Assignment Number : ${assignment.assignmentNumber}`, { align: 'center', bold: true });
    pdfDoc.fontSize(15).text(`Total Marks : ${assignment.totalMarks.toString()}`, { align: 'right', bold: true });
    for(let x = 0; x < questions.length; x++) {
    
      pdfDoc.fontSize(13).text(`Question : ${x+1}` , {
        underline: true
      });
        pdfDoc.fontSize(13).text(`  ${questions[x].questionDescription} `);
        pdfDoc.fontSize(11).text(`( ${questions[x].questionTotalMarks.toString() } ) ` , { align: 'right' });
    
    }

    const pdfBuffer = [];
    pdfDoc.on('data', (chunk) => pdfBuffer.push(chunk));
    pdfDoc.on('end', () => {
  
      const pdfDataUrl = Buffer.concat(pdfBuffer).toString('base64');

      console.log(testcasesWithQuestions)
      
      const jsonResponse = {
        Viewassignment: assignment,
        PdfDataUrl: `data:application/pdf;base64,${pdfDataUrl}`, 
        Viewquestions : questions,
        TestCase : testcasesWithQuestions

      };

      console.log(jsonResponse)


      res.status(200).json(jsonResponse);
    });
    pdfDoc.end();
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});*/
const viewAssignment = AsyncHandler(async (req, res, next) => {
  const assignmentId = req.params.aid;

  try {
    const assignment = await Assignment.findById(assignmentId);
    const questions = await question.find({ Assignment: assignmentId });

    const getTestCases = async (question) => {
      return await TestCase.find({ Question: question._id });
    };

    const testcasesWithQuestions = await Promise.all(
      questions.map(async (question) => {
        const testCases = await getTestCases(question);
        return { ...question, testCases };
      })
    );

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const pdfDoc = new PDFDocument();
    pdfDoc.font('Helvetica-Bold').fontSize(25).text(`Assignment Number : ${assignment.assignmentNumber}`, { align: 'center', bold: true });
    pdfDoc.fontSize(15).text(`Total Marks : ${assignment.totalMarks.toString()}`, { align: 'right', bold: true });

    for (let x = 0; x < questions.length; x++) {
      pdfDoc.fontSize(13).text(`Question : ${x + 1}`, {
        underline: true,
      });
      pdfDoc.fontSize(13).text(`  ${questions[x].questionDescription} `);
      pdfDoc.fontSize(11).text(`( ${questions[x].questionTotalMarks.toString() } ) `, { align: 'right' });
    }

    const pdfBuffer = [];
    pdfDoc.on('data', (chunk) => pdfBuffer.push(chunk));
    pdfDoc.on('end', () => {
      const pdfDataUrl = Buffer.concat(pdfBuffer).toString('base64');


     
      const jsonResponse = {
        Viewassignment: assignment,
        PdfDataUrl: `data:application/pdf;base64,${pdfDataUrl}`,
        Viewquestions: questions,
        TestCase: testcasesWithQuestions,
      };

      res.status(200).json(jsonResponse);
    });
    pdfDoc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = {
  viewAssignment,deleteAssignment,addAssignment,editAssignment,viewAssignmentList,viewSubmittedList
}