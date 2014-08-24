/*
 * Cerberus  Copyright (C) 2013  vertigo17
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This file is part of Cerberus.
 *
 * Cerberus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cerberus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Cerberus.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.cerberus.service;

import java.util.List;

import org.cerberus.entity.TestCaseStepAction;
import org.cerberus.exception.CerberusException;

/**
 *
 * @author bcivel
 */
public interface ITestCaseStepActionService {
    
    TestCaseStepAction findTestCaseStepActionbyKey (String test, String testCase, int step, int sequence);

    List<TestCaseStepAction> getListOfAction(String test, String testcase, int step);
    
    void insertTestCaseStepAction(TestCaseStepAction testCaseStepAction) throws CerberusException ;
    
    boolean insertListTestCaseStepAction(List<TestCaseStepAction> testCaseStepActionList);
    
    boolean changeTestCaseStepActionSequence(String test, String testCase, int step, int oldSequence, int newSequence);

    public boolean updateTestCaseStepAction(TestCaseStepAction tcsa);

    public List<TestCaseStepAction> findTestCaseStepActionbyTestTestCase(String test, String testCase) throws CerberusException ;
    
    public void deleteTestCaseStepAction(TestCaseStepAction tcsa) throws CerberusException ;

    public void deleteListTestCaseStepAction(List<TestCaseStepAction> tcsaToDelete) throws CerberusException ;
}
