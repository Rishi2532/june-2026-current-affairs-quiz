import json

def verify_july():
    with open('questions_july.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f'Total questions loaded: {len(data)}')
    assert len(data) == 594, f"Expected 594 questions, got {len(data)}"

    ids = [q['id'] for q in data]
    assert ids == list(range(1, 595)), f"IDs are not 1 to 594: min={min(ids)}, max={max(ids)}"

    ans_keys = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0}

    for idx, q in enumerate(data):
        qid = q['id']
        assert qid == idx + 1, f"Question index mismatch: {qid} vs {idx + 1}"
        assert len(q['question'].strip()) > 10, f"Q{qid} question text too short"
        assert len(q['options']) == 5, f"Q{qid} does not have 5 options"
        
        opt_keys = [opt['key'] for opt in q['options']]
        assert opt_keys == ['A', 'B', 'C', 'D', 'E'], f"Q{qid} option keys mismatch: {opt_keys}"
        
        for opt in q['options']:
            assert len(opt['text'].strip()) > 0, f"Q{qid} option {opt['key']} is empty"
            
        assert q['correctAnswer'] in ['A', 'B', 'C', 'D', 'E'], f"Q{qid} invalid answer: {q['correctAnswer']}"
        ans_keys[q['correctAnswer']] += 1
        
        assert len(q['explanation'].strip()) > 20, f"Q{qid} explanation too short or empty"

    print("VERIFICATION SUCCESSFUL: 100% PASS!")
    print(f"Total Questions: {len(data)}")
    print(f"Answer Distribution: {ans_keys}")

if __name__ == '__main__':
    verify_july()
