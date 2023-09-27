import { Card, Select } from "antd"
import { useNavigate } from "react-router-dom";
const { Option } = Select

function Home({ quizzes, setQuiz, children }) {

    let jsQuizzes = [];
    jsQuizzes = quizzes.filter((quiz) => { return quiz.name.includes("script") });
    // let cQuizzes = quizzes.filter(quiz => quiz.name.includes("c"));
    let ccQuizzes = []
    ccQuizzes = quizzes.filter((quiz, i) => { return quiz.name.includes("C++") });

    return (
        <>
            {children}
            <div className="mainBody">
                <Category categoryQuizzes={jsQuizzes} setQuiz={setQuiz}><h2>Java Script</h2></Category>
                <Category categoryQuizzes={ccQuizzes} setQuiz={setQuiz}><h2>C++</h2></Category>
            </div>
        </>
    )

}
function Category({ categoryQuizzes, children, setQuiz }) {
    function onChange(val) {
        console.log(val)
    }
    function onSearch(val) {
        console.log(val)
    }
    return (<div className="category">
        <div className="category-header">
            {children}
            <Select
                className="sort-by"
                showSearch
                placeholder="Sort By"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                <Option value="complexity">Complexity</Option>
                <Option value="date">Date</Option>
                <Option value="number">Questions Number</Option>
            </Select>
        </div>
        <div className="quizzes">
            {categoryQuizzes.map((quiz, i) => {
                return <MiniQuiz quiz={quiz} key={i} setQuiz={setQuiz} />

            })}
        </div>
        <hr></hr>
    </div>)

}
function MiniQuiz({ quiz, setQuiz, }) {
    const navigate = useNavigate()
    const quizId = quiz._id;
    function handleQuizClick(val) {
        setTimeout(navigate(`/quiz/${val}`, { replace: true }), 2000)
    }
    return (

        < Card title={quiz.name} className="quiz" onClick={() => handleQuizClick(quizId)}>
            <h3>quiz duration : {quiz.time}</h3>
            <h3>quiz questions : {quiz.questionsNumber}</h3>
            <h3>quiz description : {quiz.description}</h3>
        </Card >

    )
}
export default Home