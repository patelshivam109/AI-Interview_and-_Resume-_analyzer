try:
    from .answer_evaluator import evaluate_answer
except ImportError:
    from answer_evaluator import evaluate_answer


class InterviewSession:

    def __init__(self, questions):
        self.questions = questions
        self.current_index = 0
        self.answers = []
        self.results = []

    def get_next_question(self):

        if self.current_index < len(self.questions):
            question = self.questions[self.current_index]
            self.current_index += 1
            return question

        return None

    def submit_answer(self, question, answer):

        result = evaluate_answer(question, answer)

        self.answers.append(answer)
        self.results.append(result)

        return result

    def generate_report(self):

        if not self.results:
            return {}

        overall_scores = [r["score"] for r in self.results]
        semantic_scores = [r["breakdown"]["semantic_score"] for r in self.results]
        confidence_scores = [r["breakdown"]["confidence_score"] for r in self.results]

        report = {
            "questions_answered": len(self.results),
            "average_score": sum(overall_scores) / len(overall_scores),
            "average_semantic_score": sum(semantic_scores) / len(semantic_scores),
            "average_confidence_score": sum(confidence_scores) / len(confidence_scores),
            "detailed_results": self.results
        }

        return report
