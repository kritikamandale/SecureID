// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentVerificationLedger {
    struct VerificationRecord {
        string studentId;
        string documentHash;
        uint faceScore;
        bool verified;
        uint timestamp;
    }

    // Mapping from student ID string to an array of their verification records
    mapping(string => VerificationRecord[]) private studentRecords;

    // Event emitted when a new record is added
    event RecordAdded(string indexed studentId, string documentHash, uint faceScore, bool verified, uint timestamp);

    /**
     * @dev Add a new verification record for a student
     * @param _studentId The unique string ID of the student
     * @param _documentHash The SHA-256 hash of the sensitive data
     * @param _faceScore The similarity score of the face match
     * @param _verified Boolean indicating if verification was successful
     */
    function addVerificationRecord(
        string memory _studentId,
        string memory _documentHash,
        uint _faceScore,
        bool _verified
    ) public {
        uint _timestamp = block.timestamp;
        
        VerificationRecord memory newRecord = VerificationRecord({
            studentId: _studentId,
            documentHash: _documentHash,
            faceScore: _faceScore,
            verified: _verified,
            timestamp: _timestamp
        });

        studentRecords[_studentId].push(newRecord);

        emit RecordAdded(_studentId, _documentHash, _faceScore, _verified, _timestamp);
    }

    /**
     * @dev Get a specific verification record for a student
     * @param _studentId The unique string ID of the student
     * @param _index The index of the record in the array
     */
    function getVerificationRecord(string memory _studentId, uint _index) public view returns (VerificationRecord memory) {
        require(_index < studentRecords[_studentId].length, "Record index out of bounds");
        return studentRecords[_studentId][_index];
    }

    /**
     * @dev Get all verification records for a student
     * @param _studentId The unique string ID of the student
     */
    function getStudentHistory(string memory _studentId) public view returns (VerificationRecord[] memory) {
        return studentRecords[_studentId];
    }
}
