"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityQueue = void 0;
exports.getTopPriorityNotifications = getTopPriorityNotifications;
// Priority weights based on type
const typeWeights = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};
// Min-heap implementation for priority queue
class PriorityQueue {
    constructor(maxSize) {
        this.heap = [];
        this.maxSize = maxSize;
    }
    // Calculate priority score (higher is better)
    calculateScore(notification) {
        const typeWeight = typeWeights[notification.Type];
        const timestamp = new Date(notification.Timestamp).getTime();
        const now = Date.now();
        const recencyScore = (timestamp - now) / (1000 * 60 * 60 * 24); // Days difference
        return typeWeight * 1000 + recencyScore;
    }
    // Add notification to heap if it's among top N
    add(notification) {
        const score = this.calculateScore(notification);
        if (this.heap.length < this.maxSize) {
            this.heap.push(notification);
            this.heapifyUp(this.heap.length - 1);
        }
        else if (score > this.calculateScore(this.heap[0])) {
            this.heap[0] = notification;
            this.heapifyDown(0);
        }
    }
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.calculateScore(this.heap[parentIndex]) <= this.calculateScore(this.heap[index])) {
                break;
            }
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }
    heapifyDown(index) {
        while (index < this.heap.length) {
            let smallest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            if (leftChild < this.heap.length &&
                this.calculateScore(this.heap[leftChild]) < this.calculateScore(this.heap[smallest])) {
                smallest = leftChild;
            }
            if (rightChild < this.heap.length &&
                this.calculateScore(this.heap[rightChild]) < this.calculateScore(this.heap[smallest])) {
                smallest = rightChild;
            }
            if (smallest === index)
                break;
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
    getTopN() {
        return [...this.heap].sort((a, b) => this.calculateScore(b) - this.calculateScore(a));
    }
}
exports.PriorityQueue = PriorityQueue;
function getTopPriorityNotifications(notifications, n) {
    const pq = new PriorityQueue(n);
    notifications.forEach(notif => pq.add(notif));
    return pq.getTopN();
}
