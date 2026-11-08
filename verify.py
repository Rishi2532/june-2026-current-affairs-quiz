import json
import re

def verify_dataset(filepath='questions.json'):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Total questions loaded: {len(data)}")
    assert len(data) == 595, f"Expected 595 questions, got {len(data)}"

    ids = [q['id'] for q in data]
    assert ids == list(range(1, 596)), "Question IDs are not strictly sequential 1..595!"

    answer_dist = {}
    q_len_min = float('inf')
    q_len_max = 0
    exp_len_min = float('inf')
    exp_len_max = 0

    for i, q in enumerate(data):
        qid = q['id']
        question = q['question']
        options = q['options']
        ans = q['correctAnswer']
        exp = q['explanation']

        # Check question text
        assert isinstance(question, str) and len(question.strip()) > 5, f"Q{qid} has invalid question text"
        q_len_min = min(q_len_min, len(question))
        q_len_max = max(q_len_max, len(question))

        # Check options
        assert len(options) == 5, f"Q{qid} does not have exactly 5 options"
        keys = [o['key'] for o in options]
        assert keys == ['A', 'B', 'C', 'D', 'E'], f"Q{qid} options keys are not A, B, C, D, E: {keys}"
        for opt in options:
            assert len(opt['text'].strip()) > 0, f"Q{qid} option {opt['key']} has empty text"

        # Check answer
        assert ans in ['A', 'B', 'C', 'D', 'E'], f"Q{qid} invalid answer {ans}"
        answer_dist[ans] = answer_dist.get(ans, 0) + 1

        # Check explanation
        assert isinstance(exp, str) and len(exp.strip()) > 30, f"Q{qid} has missing or too short explanation ({len(exp)} chars)"
        exp_len_min = min(exp_len_min, len(exp))
        exp_len_max = max(exp_len_max, len(exp))

    print("ALL 595 QUESTIONS PASSED STRUCTURAL INTEGRITY VERIFICATION!")
    print(f"Answer distribution: {answer_dist}")
    print(f"Question text length range: {q_len_min} to {q_len_max} chars")
    print(f"Explanation length range: {exp_len_min} to {exp_len_max} chars")

if __name__ == '__main__':
    verify_dataset()

